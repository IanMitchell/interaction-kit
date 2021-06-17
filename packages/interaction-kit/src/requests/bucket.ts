import { Response } from "node-fetch";
import APIClient, { calculateAPIReset, getAPIOffset } from "./client";
import Queue from "../structures/queue";
import APIRequest from "./request";

export default class Bucket {
	client: APIClient;
	queue: Queue = new Queue();
	name: string;
	reset = -1;
	remaining = Infinity;
	limit = Infinity;

	constructor(client: APIClient, name: string) {
		this.client = client;
		this.name = name;
	}

	get globalLimited(): boolean {
		return (
			this.client.globalRemaining <= 0 &&
			this.client.globalReset !== undefined &&
			Date.now() < this.client.globalReset
		);
	}

	get localLimited(): boolean {
		return this.remaining <= 0 && Date.now() < this.reset;
	}

	get limited(): boolean {
		return this.globalLimited || this.localLimited;
	}

	async globalDelayFor(ms: number): Promise<void> {
		return new Promise((resolve) => {
			setTimeout(() => {
				this.client.globalDelay = undefined;
				resolve();
			}, ms);
		});
	}

	async awaitRatelimit() {
		// If a promise already exists for the global ratelimit,
		// return that instead as we don't want to create multiple promises.
		if (this.client.globalDelay) {
			return this.client.globalDelay;
		}

		if (!this.globalLimited) {
			return new Promise((resolve) => {
				setTimeout(resolve, this.reset - Date.now());
			});
		}

		if (this.globalLimited) {
			this.client.globalDelay = this.globalDelayFor(
				(this.client.globalReset ?? 0) + 100 - Date.now()
			);
			return this.client.globalDelay;
		}

		// Unhandled ratelimit reason
		return Promise.resolve();
	}

	async push(request: APIRequest): Promise<object | Buffer | undefined> {
		await this.queue.wait();
		try {
			return await this.execute(request);
		} finally {
			this.queue.shift();
		}
	}

	async execute(request: APIRequest): Promise<object | Buffer | undefined> {
		// Wait for the current ratelimit to resolve
		while (this.limited) {
			// eslint-disable-next-line no-await-in-loop
			await this.awaitRatelimit();
		}

		// As the request goes out, update the global usage information
		if (!this.client.globalReset || this.client.globalReset < Date.now()) {
			this.client.globalReset = Date.now() + 1000;
			this.client.globalRemaining = this.client.globalLimit;
		}

		this.client.globalRemaining--;

		const retryRequest = async (error: Error) => {
			if (request.retries === 3) {
				throw new Error(
					`Error [${request.method}] ${request.path}\n\t${error.message}`
				);
			}

			request.retries++;

			return this.execute(request);
		};

		// Perform the request
		let res: Response;
		try {
			res = await request.execute();
		} catch (error: unknown) {
			return retryRequest(error as Error);
		}

		if (res?.headers) {
			const serverDate = res.headers.get("date") ?? new Date().toString();
			const limit = res.headers.get("x-ratelimit-limit");
			const remaining = res.headers.get("x-ratelimit-remaining");
			const reset = res.headers.get("x-ratelimit-reset");

			// Update ratelimit usage
			this.limit = limit ? Number(limit) : Infinity;
			this.remaining = remaining ? Number(remaining) : 1;
			this.reset = reset ? calculateAPIReset(reset, serverDate) : Date.now();

			// https://github.com/discordapp/discord-api-docs/issues/182
			if (request.route.includes("reactions")) {
				this.reset =
					new Date(serverDate).getTime() - getAPIOffset(serverDate) + 250;
			}

			// Handle retryAfter, which means we somehow hit a rate limit
			const retryAfter = res.headers.get("retry-after")
				? Number(res.headers.get("retry-after")) * 1000
				: -1;
			if (retryAfter > 0) {
				// If the global ratelimit header is set, we hit the global rate limit (uh oh)
				if (res.headers.get("x-ratelimit-global")) {
					this.client.globalRemaining = 0;
					this.client.globalReset = Date.now() + retryAfter;
				}

				// Wait then retry the request
				await new Promise((pr) => {
					setTimeout(pr, retryAfter);
				});

				return retryRequest(new Error("ratelimit hit"));
			}

			if (res.ok) {
				// Request succeeded, continue with the next one
				if (res.headers.get("content-type")?.startsWith("application/json")) {
					return (await res.json()) as object | Buffer | undefined;
				}

				return res.buffer();
			}

			// We did something wrong apparently
			if (res.status >= 400 && res.status < 500) {
				// Ratelimited, retry
				if (res.status === 429) {
					return retryRequest(new Error("unexpected ratelimit encountered"));
				}

				// Throw an error with the error received from the API
				const data = (
					res.headers.get("content-type")?.startsWith("application/json")
						? await res.json()
						: { message: "Error was not JSON encoded.", code: 0 }
				) as Record<string, string>;

				throw new Error(
					`Error [${request.method}] ${res.status} ${
						request.path
					}\n${JSON.stringify(data, null, 2)}`
				);
			}
		}
	}
}
