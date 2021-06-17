import Bucket from "./bucket";
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
	#globalReset: number;

	constructor() {
		this.#buckets = new Map();
		this.#globalReset = 0;
	}

	async checkGlobalRateLimit() {
		return new Promise((resolve) => {
			if (this.#globalReset === 0) {
				return resolve(true);
			}

			return setTimeout(() => {
				this.#globalReset = 0;
				resolve(true);
			}, Date.now() - 1000 * this.#globalReset);
		});
	}

	setGlobalReset(timestamp: number) {
		this.#globalReset = Math.ceil(timestamp);
	}

	async #queue(route: string, options: RequestInit, bucket: BucketClassifier) {
		if (bucket?.route == null || bucket?.identifier == null) {
			throw new Error("You must defined a bucket route and identifier");
		}

		if (!this.#buckets.has(bucket?.route)) {
			this.#buckets.set(
				bucket.route,
				new Map([[bucket.identifier, new Bucket(this.checkGlobalRateLimit)]])
			);
		}

		if (!this.#buckets.get(bucket.route)!.has(bucket.identifier)) {
			this.#buckets
				.get(bucket.route)!
				.set(bucket.identifier, new Bucket(this.checkGlobalRateLimit));
		}

		return this.#buckets
			.get(bucket.route)!
			.get(bucket.identifier)!
			.request(route, options);
	}

	async get(url: string, options: RequestInit, bucket: BucketClassifier) {
		return this.#queue(url, { method: "GET", ...options }, bucket);
	}

	async post(url: string, options: RequestInit, bucket: BucketClassifier) {
		return this.#queue(url, { method: "POST", ...options }, bucket);
	}

	async patch(url: string, options: RequestInit, bucket: BucketClassifier) {
		return this.#queue(url, { method: "PATCH", ...options }, bucket);
	}

	async put(url: string, options: RequestInit, bucket: BucketClassifier) {
		return this.#queue(url, { method: "PUT", ...options }, bucket);
	}

	async delete(url: string, options: RequestInit, bucket: BucketClassifier) {
		return this.#queue(url, { method: "DELETE", ...options }, bucket);
	}
}

export default (() => new Client())();
