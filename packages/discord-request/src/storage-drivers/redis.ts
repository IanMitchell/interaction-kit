import redis, { RedisClientType } from "redis";
import type { StorageDriver } from "../types.js";

interface RedisStorageDriverOptions {
	url: string;
	defaultTTL?: number;
}

export default class RedisStorageDriver implements StorageDriver {
	client: RedisClientType;
	defaultTTL = 300;
	readyPromise: Promise<void> | undefined;

	constructor({ url, defaultTTL }: RedisStorageDriverOptions) {
		this.client = redis.createClient({
			url,
		});

		// lock until ready
		this.readyPromise = new Promise((resolve) => {
			this.client.connect().then(resolve);
		}).then(() => {
			this.readyPromise = undefined;
		});

		this.defaultTTL = defaultTTL ?? this.defaultTTL;
	}

	async get<T>(key: string, fallback?: T): Promise<T> {
		if (this.readyPromise) await this.readyPromise;

		const data = (await this.client.get(key)) ?? fallback;
		return (fallback instanceof Number ? Number(data) : data) as T;
	}

	async set(
		key: string,
		value: any,
		ttl: number = this.defaultTTL
	): Promise<void> {
		if (this.readyPromise) await this.readyPromise;

		await this.client.set(key, value, { EX: ttl });
	}

	async increment(key: string, value: number = 1): Promise<void> {
		if (this.readyPromise) await this.readyPromise;

		await this.client.incrBy(key, value);
	}
}
