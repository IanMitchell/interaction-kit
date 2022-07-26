import type { Callbacks, ManagerArgs } from "./manager";
import { Manager } from "./manager";
import type { RequestData, RequestOptions } from "./types";
import { RequestMethod } from "./types";

export default class Client {
	#manager: Manager;

	constructor(options: ManagerArgs = {}) {
		this.#manager = new Manager(options);
	}

	setToken(token: string) {
		this.#manager.setToken(token);
		return this;
	}

	get userAgent() {
		return this.#manager.config.userAgent;
	}

	set userAgent(value: string) {
		this.#manager.config.userAgent = value;
	}

	get abortSignal() {
		return this.#manager.shutdownSignal;
	}

	set abortSignal(signal: AbortSignal | null | undefined) {
		this.#manager.shutdownSignal = signal;
	}

	get globalRequestsPerSecond() {
		return this.#manager.config.globalRequestsPerSecond;
	}

	set globalRequestsPerSecond(value: number) {
		this.#manager.config.globalRequestsPerSecond = value;
	}

	get api() {
		return {
			api: this.#manager.config.api,
			version: this.#manager.config.version,
			cdn: this.#manager.config.cdn,
		};
	}

	set api({
		api,
		version,
		cdn,
	}: {
		api: string;
		version: number;
		cdn: string;
	}) {
		this.#manager.config.api = api;
		this.#manager.config.version = version;
		this.#manager.config.cdn = cdn;
	}

	get requestConfig() {
		return {
			headers: this.#manager.config.headers,
			retries: this.#manager.config.retries,
			timeout: this.#manager.config.timeout,
		};
	}

	set requestConfig({
		headers,
		retries,
		timeout,
	}: {
		headers: Record<string, string>;
		retries: number;
		timeout: number;
	}) {
		this.#manager.config.headers = headers;
		this.#manager.config.retries = retries;
		this.#manager.config.timeout = timeout;
	}

	get sweepIntervals() {
		return {
			bucketSweepInterval: this.#manager.bucketSweepInterval,
			queueSweepInterval: this.#manager.queueSweepInterval,
		};
	}

	set sweepIntervals({
		bucketSweepInterval,
		queueSweepInterval,
	}: {
		bucketSweepInterval: number;
		queueSweepInterval: number;
	}) {
		this.#manager.bucketSweepInterval = bucketSweepInterval;
		this.#manager.queueSweepInterval = queueSweepInterval;
	}

	get callbacks() {
		return {
			onBucketSweep: this.#manager.onBucketSweep,
			onQueueSweep: this.#manager.onQueueSweep,
			onRateLimit: this.#manager.onRateLimit,
			onRequest: this.#manager.onRequest,
		};
	}

	set callbacks({
		onBucketSweep,
		onQueueSweep,
		onRateLimit,
		onRequest,
	}: {
		onBucketSweep?: Callbacks["onBucketSweep"] | undefined;
		onQueueSweep?: Callbacks["onQueueSweep"] | undefined;
		onRateLimit?: Callbacks["onRateLimit"] | undefined;
		onRequest?: Callbacks["onRequest"] | undefined;
	}) {
		this.#manager.onBucketSweep = onBucketSweep;
		this.#manager.onQueueSweep = onQueueSweep;
		this.#manager.onRateLimit = onRateLimit;
		this.#manager.onRequest = onRequest;
	}

	async get(path: string, options: RequestOptions = {}) {
		return this.#request({
			path,
			method: RequestMethod.Get,
			...options,
		});
	}

	async post(path: string, options: RequestOptions = {}) {
		return this.#request({
			path,
			method: RequestMethod.Post,
			...options,
		});
	}

	async put(path: string, options: RequestOptions = {}) {
		return this.#request({
			path,
			method: RequestMethod.Put,
			...options,
		});
	}

	async patch(path: string, options: RequestOptions = {}) {
		return this.#request({
			path,
			method: RequestMethod.Patch,
			...options,
		});
	}

	async delete(path: string, options: RequestOptions = {}) {
		return this.#request({
			path,
			method: RequestMethod.Delete,
			...options,
		});
	}

	async #request(data: RequestData) {
		return this.#manager.queue(data);
	}
}
