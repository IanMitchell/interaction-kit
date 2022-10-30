import { StorageDriver } from "../types.js";

export default class MemoryStorageDriver implements StorageDriver {
	private data: Map<string, any>;

	constructor() {
		this.data = new Map();
	}

	async get<T>(key: string, fallback?: T): Promise<T> {
		const data = this.data.get(key) ?? fallback;
		return fallback instanceof Number ? Number(data) : data;
	}

	async set(key: string, value: any, ttl: number): Promise<void> {
		this.data.set(key, value);
	}

	async increment(key: string, value: number = 1): Promise<void> {
		const current = this.data.get(key);
		this.data.set(key, current + value);
	}
}
