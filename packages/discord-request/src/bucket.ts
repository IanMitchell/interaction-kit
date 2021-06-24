import type { URL } from "url";
import type { RequestInit } from "node-fetch";
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
			return new Promise((resolve) =>
				setTimeout(() => resolve(true), this.#resetAfter)
			);
		}

		return Promise.resolve();
	}

	setResetAfter(resetAfter: number, global = false) {
		if (resetAfter > 0) {
			if (global) {
				this.#setGlobalRateLimit(resetAfter);
			} else {
				this.#resetAfter = resetAfter;
			}
		}
	}

	// #retry(callback, times = 3) {}

	request(url: URL, options: RequestInit) {
		// TODO: This return is probably wrong. We might need to return a standalone promise wrapper? Not sure
		return this.#queue.then(async () => {
			await this.#checkRateLimit();

			// execute request
			// TODO: Add 3 time retry
			try {
				const response = await fetch(url, options);

				if (response.headers != null) {
					const id = response.headers.get("x-ratelimit-bucket");
					// TODO: Do we need these?
					// const date = response.headers.get("date") ?? new Date().toJSON();
					// const limit = response.headers.get("x-ratelimit-limit");
					// const remaining = response.headers.get("x-ratelimit-remaining");
					// const reset = 1000 * parseFloat(response.headers.get("x-ratelimit-reset"));
					const resetAfter =
						1000 *
						parseFloat(response.headers.get("x-ratelimit-reset-after") ?? "0");
					const global = parseBoolean(
						response.headers.get("x-ratelimit-global")
					);

					// Validate our  bucket assignment is correct
					if (this.#identifier == null) {
						this.#identifier = id;
					}

					if (this.#identifier !== id) {
						console.warn(
							`[BUCKET ERROR]: The url ${url} has an incorrect bucket assignment. This is likely a problem with the library; please open an issue on GitHub here: <TODO: URL>`
						);
					}

					// Assign reset variables
					this.setResetAfter(resetAfter, global);
				}

				if (!response.ok) {
					// Special handling for rate limits
					if (response.status === 429) {
						const json = await response.json();
						this.setResetAfter(1000 * json.retry_after, json.global);
						// TODO: Call retry and return result of it. This should in theory move the retry to the front of the queue when implemented
					} else {
						switch (response.status) {
							case 500:
							// TODO: Handle breaks
							default:
								console.log({ fn: console.warn });
								console.warn(
									`[BUCKET ERROR]: The url ${url} returned a status code ${response.status} which Interaction Kit does not know how to handle yet. This is a library issue; please open an issue on GitHub here: <TODO: URL>`
								);
						}
					}
				}

				const json = await response.json();
				return Promise.resolve(json);
			} catch (error) {
				console.error(error);
				return Promise.reject(error);
			}
		});
	}
}
