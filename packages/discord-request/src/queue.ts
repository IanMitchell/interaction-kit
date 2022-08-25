import debug from "debug";
import type { ErrorBody } from "discord-error";
import { DiscordError, isDiscordError } from "discord-error";
import { RequestError } from "./errors/request-error.js";
import type { Manager } from "./manager.js";
import type { RequestMethod, Route } from "./types.js";
import { parse } from "./util/response.js";
import { getRouteKey } from "./util/routes.js";
import { OFFSET, ONE_HOUR, sleep } from "./util/time.js";

const log = debug("discord-request:queue");

export class Queue {
	lastRequest = -1;
	reset = -1;
	remaining = 1;
	limit = Infinity;
	manager: Manager;
	id: string;

	#queue: Promise<void>;
	#shutdownSignal: AbortSignal | null | undefined;

	constructor(
		manager: Manager,
		id: string,
		shutdownSignal?: AbortSignal | null
	) {
		this.manager = manager;
		this.id = id;

		this.#queue = Promise.resolve();
		this.#shutdownSignal = shutdownSignal;
	}

	get inactive() {
		return Date.now() > this.lastRequest + 2 * ONE_HOUR;
	}

	isLocalLimited() {
		return this.remaining <= 0 && this.reset > Date.now();
	}

	getResetDelay() {
		return this.reset + OFFSET - Date.now();
	}

	async add(route: Route, resource: string, init: RequestInit) {
		return new Promise((resolve) => {
			// TODO: Handle thrown errors from #process
			void this.#queue.then(async () => {
				const value = await this.#process(route, resource, init);
				resolve(value);
			});
		});
	}

	async #process(
		route: Route,
		resource: string,
		init: RequestInit,
		retries = 0
	): Promise<unknown> {
		await this.#rateLimitThrottle();

		// As the request goes out, update the global request counter
		if (this.manager.globalReset < Date.now()) {
			this.manager.globalReset = Date.now() + 1000;
			this.manager.globalRequestCounter =
				this.manager.config.globalRequestsPerSecond;
		}

		this.manager.globalRequestCounter -= 1;

		// Setup the timeout signal
		const signal = new AbortController();
		const abortTimeout = setTimeout(() => {
			signal.abort();
		}, this.manager.config.timeout);
		const clearAbort = () => {
			clearTimeout(abortTimeout);
		};

		this.#shutdownSignal?.addEventListener("signal", clearAbort);

		// Callbacks
		this.manager.onRequest?.(route, resource, init, retries);

		// Send the request
		const request = new Request(resource, init);
		let response: Response;

		try {
			response = await fetch(request, { signal: signal.signal });
		} catch (error: unknown) {
			// Handle timeout aborts
			if (
				error instanceof Error &&
				error.name === "AbortError" &&
				retries < this.manager.config.retries
			) {
				return await this.#process(route, resource, init, retries + 1);
			}

			throw error;
		} finally {
			this.#shutdownSignal?.removeEventListener("signal", clearAbort);
			clearAbort();
		}

		// Parse Rate Limit information
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

		// Handle global rate limits
		if (global && retryAfter > 0) {
			this.manager.globalRequestCounter = 0;
			this.manager.globalReset = Date.now() + retryAfter;
		}

		// Update bucket hashes as needed
		const identifier = getRouteKey(init.method as RequestMethod, route);

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

		// Successful Requests
		if (response.ok) {
			return parse(response);
		}

		// Rate Limited Requests
		if (response.status === 429) {
			const rateLimitData = {
				retryAfter,
				bucket: this.id,
				url: resource,
				limit: this.limit,
				route: route.path,
				identifier: route.identifier,
				global,
				method: init.method as RequestMethod,
			};

			this.manager.onRateLimit?.(rateLimitData);

			log(`Encountered 429 rate limit. ${JSON.stringify(rateLimitData)}.`);
			await sleep(retryAfter, this.#shutdownSignal);

			// Don't bump retries for a non-server issue (the request is expected to succeed)
			return this.#process(route, resource, init, retries);
		}

		// If given a server error, retry the request
		if (response.status >= 500 && response.status < 600) {
			if (retries < this.manager.config.retries) {
				return this.#process(route, resource, init, retries + 1);
			}

			throw new RequestError(
				resource,
				init,
				// `response` has not yet been consumed by this point, it is safe to pass an uncloned version
				response,
				`Discord Server Error encountered: ${response.statusText}`
			);
		}

		// Handle non-ratelimited bad requests
		if (response.status >= 400 && response.status < 500) {
			// If we receive a 401 status code, it means the token we had is no longer valid.
			const isAuthRequest = new Headers(init.headers).has("Authorization");
			if (response.status === 401 && isAuthRequest) {
				this.manager.setToken(null);
			}

			// Handle unknown API errors
			const data: ErrorBody = await response.json();
			const label = isDiscordError(data) ? data.code : data.error;

			throw new DiscordError(request, response, label, data);
		}

		return response;
	}

	async #rateLimitThrottle() {
		while (this.manager.isGlobalLimited() || this.isLocalLimited()) {
			const isGlobal = this.manager.isGlobalLimited();

			// TODO: Make this use retryAfter
			const timeout = isGlobal
				? this.manager.globalTimeout
				: this.getResetDelay();
			const delay = isGlobal
				? this.manager.globalDelay ?? this.manager.setGlobalDelay(timeout)
				: sleep(timeout);

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
