import debug from "debug";
import { Manager } from "./manager";
import { RequestMethod, Route } from "./types";
import { isSublimitedRoute } from "./util/routes";
import { OFFSET, ONE_HOUR, ONE_MINUTE, sleep } from "./util/time";

const log = debug("discord-request:queue");

export default class Queue {
	lastProcessed = -1;
	reset = -1;
	remaining = 1;
	limit = Infinity;
	manager: Manager;
	id: string;

	#queue: Promise<void>;
	#sublimitQueue: Promise<void> | null;
	#sublimitQueueSize = 0;

	#shutdownSignal?: AbortSignal | null;

	constructor(
		manager: Manager,
		id: string,
		shutdownSignal?: AbortSignal | null
	) {
		this.manager = manager;
		this.id = id;

		this.#queue = Promise.resolve();
		this.#sublimitQueue = null;
		this.#shutdownSignal = shutdownSignal;
	}

	get inactive() {
		// TODO: Check this
		return this.lastProcessed > Date.now() - 4 * ONE_HOUR;
	}

	isLocalLimited() {
		return this.remaining <= 0 && Date.now() < this.reset;
	}

	getResetDelay() {
		return this.reset + OFFSET - Date.now();
	}

	isSublimited(
		bucketRoute: string,
		body: RequestInit["body"],
		method: RequestMethod
	) {
		return (
			this.#sublimitQueue != null &&
			isSublimitedRoute(bucketRoute, body, method)
		);
	}

	async add(parameters: Route, resource: string, init: RequestInit, options) {
		let target = this.#queue;

		if (
			this.isSublimited(
				parameters.path,
				init.body,
				(init.method as RequestMethod) ?? RequestMethod.Get
			)
		) {
			target = this.#sublimitQueue!;
			this.#sublimitQueueSize += 1;
		}

		return new Promise((resolve) => {
			void target
				.then(async () => {
					const value = await this.#process(routeId, url, options, requestData);
					resolve(value);
				})
				.finally(() => {
					this.#sublimitQueueSize -= 1;

					if (this.#sublimitQueueSize === 0) {
						this.#sublimitQueue = null;
					}
				});
		});
	}

	async #process(
		parameters: Route,
		resource: string,
		init: RequestInit,
		options,
		retries = 0
	): Promise<unknown> {
		await this.#rateLimitThrottle(parameters, init.method as RequestMethod);

		// As the request goes out, update the global request counter
		if (this.manager.globalReset < Date.now()) {
			this.manager.globalReset = Date.now() + 1000;
			this.manager.globalRequestCounter =
				this.manager.config.globalRequestsPerSecond;
		}

		this.manager.globalRequestCounter -= 1;

		this.manager.onRequest?.(parameters, resource, init, options, retries);

		// Setup the timeout signal
		const signal = new AbortController();
		const abortTimeout = setTimeout(() => {
			signal.abort();
		}, this.manager.config.timeout);
		const clearAbort = () => {
			clearTimeout(abortTimeout);
		};

		this.#shutdownSignal?.addEventListener("signal", clearAbort);

		let response: Response;

		// Send the request
		try {
			response = await fetch(resource, { ...options, signal: signal.signal });
		} catch (error: unknown) {
			if (
				error instanceof Error &&
				error.name === "AbortError" &&
				retries < this.manager.config.retries
			) {
				return await this.#process(
					parameters,
					resource,
					init,
					options,
					retries + 1
				);
			}

			throw error;
		} finally {
			this.#shutdownSignal?.removeEventListener("signal", clearAbort);
			clearAbort();
		}

		let retryAfter = 0;

		const global = Boolean(response.headers.get("X-RateLimit-Global"));
		const key = response.headers.get("X-RateLimit-Bucket");

		const retry = response.headers.get("Retry-After");
		const reset = response.headers.get("X-RateLimit-Reset-After");
		const limit = response.headers.get("X-RateLimit-Limit");
		const remaining = response.headers.get("X-RateLimit-Remaining");

		this.reset = reset
			? 1000 * Number(reset) + Date.now() + OFFSET
			: Date.now();
		this.limit = limit ? Number(limit) : Infinity;
		this.remaining = remaining ? Number(remaining) : 1;

		if (retry != null) {
			retryAfter = Number(retry) * 1000 + OFFSET;
		}

		// Update bucket hashes as needed
		const identifier = `${init.method ?? "get"}:${parameters.path}`;

		if (key != null && key !== this.id) {
			log(`Received new bucket hash. ${this.id} -> ${key}`);

			this.manager.buckets.set(identifier, {
				key,
				lastRequest: Date.now(),
			});
		} else if (key != null && this.manager.buckets.has(identifier)) {
			this.manager.buckets.set(identifier, {
				key,
				lastRequest: Date.now(),
			});
		}

		// Handle rate limits
		let sublimitTimeout: number | null = null;

		if (retryAfter > 0) {
			if (global) {
				this.manager.globalRequestCounter = 0;
				this.manager.globalReset = Date.now() + retryAfter;
			} else if (!this.isLocalLimited()) {
				sublimitTimeout = retryAfter;
			}
		}

		// Successful Requests
		if (response.ok) {
			return response.json();
		}

		// Rate Limited Requests
		if (response.status === 429) {
			const isGlobal = this.manager.isGlobalLimited();

			const limit = isGlobal
				? this.manager.config.globalRequestsPerSecond
				: this.limit;
			const timeout = isGlobal
				? this.manager.globalTimeout
				: this.getResetDelay();

			this.manager.onRateLimit({
				// timeout,
				// limit,
				// method,
				// hash: this.hash,
				// url,
				// route: routeId.bucketRoute,
				// majorParameter: this.majorParameter,
				// global: isGlobal,
			});

			// this.debug(
			// 	[
			// 		"Encountered unexpected 429 rate limit",
			// 		`  Global         : ${isGlobal.toString()}`,
			// 		`  Method         : ${method}`,
			// 		`  URL            : ${url}`,
			// 		`  Bucket         : ${routeId.bucketRoute}`,
			// 		`  Major parameter: ${routeId.majorParameter}`,
			// 		`  Hash           : ${this.hash}`,
			// 		`  Limit          : ${limit}`,
			// 		`  Retry After    : ${retryAfter}ms`,
			// 		`  Sublimit       : ${
			// 			sublimitTimeout ? `${sublimitTimeout}ms` : "None"
			// 		}`,
			// 	].join("\n")
			// );

			// If caused by a sublimit, wait it out here so other requests on the route can be handled
			if (sublimitTimeout) {
				if (this.#sublimitQueue == null) {
					this.#sublimitedQueue = Promise.resolve();
					// void this.#sublimitedQueue.wait();
					// this.#asyncQueue.shift();
				}
				this.#sublimitPromise?.resolve();
				this.#sublimitPromise = null;
				await sleep(sublimitTimeout, undefined, { ref: false });
				let resolve: () => void;
				const promise = new Promise<void>((res) => (resolve = res));
				this.#sublimitPromise = { promise, resolve: resolve! };
				if (firstSublimit) {
					// Re-queue this request so it can be shifted by the finally
					await this.#asyncQueue.wait();
					this.#shiftSublimit = true;
				}
			}

			// Don't bump retries for a non-server issue (the request is expected to succeed)
			return this.#process(parameters, resource, init, options, retries);
		}

		// If given a server error, retry the request
		if (response.status >= 500 && response.status < 600) {
			if (retries < this.manager.config.retries) {
				return this.#process(parameters, resource, init, options, retries + 1);
			}

			throw new RequestError(resource, init, response);
		}

		if (response.status >= 400 && response.status < 500) {
			// If we receive this status code, it means the token we had is no longer valid.
			if (response.status === 401 && requestData.auth) {
				this.manager.setToken(null!);
			}
			// The request will not succeed for some reason, parse the error returned from the api
			const data = (await response.json()) as DiscordErrorData | OAuthErrorData;

			// throw the API error
			throw new APIError(
				data,
				"code" in data ? data.code : data.error,
				res.status,
				method,
				url,
				requestData
			);
		}

		return response;
	}

	async #rateLimitThrottle(route: Route, method: RequestMethod) {
		while (this.manager.isGlobalLimited() || this.isLocalLimited()) {
			const isGlobal = this.manager.isGlobalLimited();

			const limit = isGlobal
				? this.manager.config.globalRequestsPerSecond
				: this.limit;
			const timeout = isGlobal
				? this.manager.globalTimeout
				: this.getResetDelay();
			const delay = isGlobal
				? this.manager.globalDelay ?? this.manager.setGlobalDelay(timeout)
				: sleep(timeout);

			this.manager.onRateLimit?.({
				timeToReset: timeout,
				limit,
				method: method ?? RequestMethod.Get,
				id: this.id,
				url,
				path: route.path,
				majorParameter: route.primaryId,
				global: isGlobal,
			});

			if (isGlobal) {
				log(
					`Global rate limit reached. Blocking all requests for ${timeout}ms`
				);
			} else {
				log(
					`${this.id} encountered a local rate limit. Waiting ${timeout}ms before continuing`
				);
			}

			await delay;
		}
	}
}
