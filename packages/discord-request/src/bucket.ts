import type { URL } from "url";
import type { RequestInit, Response } from "node-fetch";
import fetch from "node-fetch";

function parseBoolean(
	bool: string | number | boolean | undefined | null
): boolean {
	if (bool == null) {
		return false;
	}

	switch (bool) {
		case false:
		case "false":
		case "False":
		case 0:
		case "0":
			return false;
		case true:
		case "true":
		case "True":
		case 1:
		case "1":
		default:
			return true;
	}
}

function parseRateLimit(json: Record<string, unknown>): {
	global: boolean;
	retryAfter: number;
} {
	return {
		global: Boolean(json?.global) ?? false,
		retryAfter: Number(json?.retryAfter) || 0,
	};
}

export default class Bucket {
	#checkGlobalRateLimit: () => unknown;
	#setGlobalRateLimit: (timestamp: number) => unknown;
	#queue: Promise<void>;
	#resetAfter: number;
	#identifier: string | null;

	constructor(
		globalRateLimit: () => unknown,
		setGlobalRateLimit: (timestamp: number) => unknown
	) {
		this.#checkGlobalRateLimit = globalRateLimit;
		this.#setGlobalRateLimit = setGlobalRateLimit;
		this.#queue = Promise.resolve();
		this.#resetAfter = -1;
		this.#identifier = null;
	}

	async #checkRateLimit() {
		await this.#checkGlobalRateLimit();

		if (this.#resetAfter > 0) {
			return new Promise((resolve) => {
				setTimeout(() => {
					this.#resetAfter = 0;
					resolve(true);
				}, this.#resetAfter);
			});
		}

		return Promise.resolve();
	}

	setResetAfter(remaining: number, resetAfter: number, global = false) {
		if (remaining <= 0 && resetAfter > 0) {
			if (global) {
				this.#setGlobalRateLimit(resetAfter);
			} else {
				this.#resetAfter = resetAfter;
			}
		}
	}

	// #retry(callback, times = 3) {}

	async request(url: URL, options: RequestInit): Promise<Response> {
		// TODO: This return is probably wrong. We might need to return a standalone promise wrapper? Not sure
		return this.#queue.then(async () => {
			await this.#checkRateLimit();

			// execute request
			// TODO: Add 3 time retry
			try {
				const response = await fetch(url, options);

				if (response.headers != null) {
					const id = response.headers.get("x-ratelimit-bucket");
					// Unused headers:
					// const date = response.headers.get("date") ?? new Date().toJSON();
					// const limit = response.headers.get("x-ratelimit-limit");
					// const reset = 1000 * parseFloat(response.headers.get("x-ratelimit-reset"));

					const remaining = parseInt(
						response.headers.get("x-ratelimit-remaining") ?? "1",
						10
					);
					const resetAfter =
						1000 *
						parseFloat(response.headers.get("x-ratelimit-reset-after") ?? "0");
					const isGlobal = parseBoolean(
						response.headers.get("x-ratelimit-global")
					);

					// Validate our  bucket assignment is correct
					if (this.#identifier == null) {
						this.#identifier = id;
					}

					if (this.#identifier !== id) {
						console.warn(
							`[BUCKET ERROR]: The url ${url.toString()} has an incorrect bucket assignment. This is likely a problem with the library using Discord Request.`
						);
					}

					// Assign reset variables
					this.setResetAfter(remaining, resetAfter, isGlobal);
				}

				if (!response.ok) {
					// Special handling for rate limits
					if (response.status === 429) {
						const json = parseRateLimit(
							(await response.json()) as Record<string, unknown>
						);
						this.setResetAfter(-1, 1000 * json.retryAfter, json.global);
						// TODO: Call retry and return result of it. This should in theory move the retry to the front of the queue when implemented
					} else {
						switch (response.status) {
							// TODO: Handle breaks
							case 500:
							default:
								console.warn(
									`[BUCKET ERROR]: The url [${
										options?.method ?? "GET"
									}] ${url.toString()} returned a status code ${
										response.status
									} which Discord Request does not know how to handle yet. This is a library issue; please open an issue on GitHub here: https://github.com/IanMitchell/interaction-kit/issues`
								);
						}
					}
				}

				return response;
			} catch (error: unknown) {
				console.error(error);
				throw error;
			}
		});
	}
}
