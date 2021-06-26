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

	async checkGlobalRateLimit() {
		return new Promise((resolve) => {
			if (this.#globalResetAfter === 0) {
				resolve(true);
			}

			setTimeout(() => {
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
			console.log({ rip: true });
			throw new Error("You must define a bucket route and identifier");
		} else {
			console.log({ bucket });
		}

		let routeMap;
		let targetBucket;

		if (this.#buckets.has(bucket?.route)) {
			routeMap = this.#buckets.get(bucket?.route);
		} else {
			routeMap = new Map([
				[
					bucket.identifier,
					new Bucket(this.checkGlobalRateLimit, this.setGlobalReset),
				],
			]);
			this.#buckets.set(bucket.route, routeMap);
		}

		if (routeMap?.has(bucket.identifier)) {
			targetBucket = routeMap.get(bucket.identifier);
		} else {
			targetBucket = new Bucket(this.checkGlobalRateLimit, this.setGlobalReset);
			routeMap?.set(bucket.identifier, targetBucket);
		}

		return targetBucket?.request(url, options);
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
