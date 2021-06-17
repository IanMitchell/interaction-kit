import type { RequestInit } from "node-fetch";
import fetch from "node-fetch";

export default class Bucket {
	#checkGlobalRateLimit: () => unknown;
	#setGlobalRateLimit: (timestamp: number) => unknown;
	#queue: Promise<void>;
	#reset: number;
	#identifier: string | null;

	constructor(
		globalRateLimit: () => unknown,
		setGlobalRateLimit: (timestamp: number) => unknown
	) {
		this.#checkGlobalRateLimit = globalRateLimit;
		this.#setGlobalRateLimit = setGlobalRateLimit;
		this.#queue = Promise.resolve();
		this.#reset = -1;
		this.#identifier = null;
	}

	async #checkRateLimit() {
		await this.#checkGlobalRateLimit();

		if (this.#reset > 0) {
			return new Promise((resolve) =>
				setTimeout(() => resolve(true), this.#reset - Date.now())
			);
		}

		return Promise.resolve();
	}

	#retry(callback, times = 3) {}

	request(url: string, options: RequestInit) {
		this.#queue.then(async () => {
			await this.#checkRateLimit();

			// execute request
			// TODO: Add 3 time retry
			const response = await fetch(url, options);

			if (response.headers != null) {
				const id = response.headers.get("x-ratelimit-bucket");
				const date = response.headers.get("date") ?? new Date().toJSON();
				const limit = response.headers.get("x-ratelimit-limit");
				const remaining = response.headers.get("x-ratelimit-remaining");
				const reset = response.headers.get("x-ratelimit-reset");
				const global = response.headers.get("x-ratelimit-global");

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
				if (reset > 0) {
					if (global) {
						this.#setGlobalRateLimit(reset);
					} else {
						this.#reset = reset;
					}
				}
			}

			if (!response.ok) {
				// TODO: Handle 300s
				// TODO: Handle 400s
				// TODO: Handle 500s
			}

			const json = await response.json();
			return Promise.resolve(json);
		});
	}
}
