import Bucket from "./bucket";
import type { URL } from "url";
import type { RequestInit } from "node-fetch";

type BucketClassifier = {
	route: string;
	identifier: string;
};

class Client {
	#buckets: Map<
		BucketClassifier["route"],
		Map<BucketClassifier["identifier"], Bucket>
	>;
	#globalResetAfter: number;

	constructor() {
		this.#buckets = new Map();
		this.#globalResetAfter = 0;
	}

	reset() {
		// TODO: Will this cause a memory leak?
		this.#buckets = new Map();
		this.#globalResetAfter = 0;
	}

	async checkGlobalRateLimit() {
		return new Promise((resolve) => {
			if (this.#globalResetAfter === 0) {
				return resolve(true);
			}

			return setTimeout(() => {
				this.#globalResetAfter = 0;
				resolve(true);
			}, this.#globalResetAfter);
		});
	}

	setGlobalReset(timestamp: number) {
		this.#globalResetAfter = timestamp;
	}

	async #queue(url: URL, options: RequestInit, bucket: BucketClassifier) {
		if (bucket?.route == null || bucket?.identifier == null) {
			throw new Error("You must defined a bucket route and identifier");
		}

		if (!this.#buckets.has(bucket?.route)) {
			this.#buckets.set(
				bucket.route,
				new Map([
					[
						bucket.identifier,
						new Bucket(this.checkGlobalRateLimit, this.setGlobalReset),
					],
				])
			);
		}

		if (!this.#buckets.get(bucket.route)!.has(bucket.identifier)) {
			this.#buckets
				.get(bucket.route)!
				.set(
					bucket.identifier,
					new Bucket(this.checkGlobalRateLimit, this.setGlobalReset)
				);
		}

		return this.#buckets
			.get(bucket.route)!
			.get(bucket.identifier)!
			.request(url, options);
	}

	async get(url: URL, options: RequestInit, bucket: BucketClassifier) {
		return this.#queue(url, { method: "GET", ...options }, bucket);
	}

	async post(url: URL, options: RequestInit, bucket: BucketClassifier) {
		return this.#queue(url, { method: "POST", ...options }, bucket);
	}

	async patch(url: URL, options: RequestInit, bucket: BucketClassifier) {
		return this.#queue(url, { method: "PATCH", ...options }, bucket);
	}

	async put(url: URL, options: RequestInit, bucket: BucketClassifier) {
		return this.#queue(url, { method: "PUT", ...options }, bucket);
	}

	async delete(url: URL, options: RequestInit, bucket: BucketClassifier) {
		return this.#queue(url, { method: "DELETE", ...options }, bucket);
	}
}

export default (() => new Client())();
