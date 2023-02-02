import pkg from "../package.json" assert { type: "json" };
import type { Callbacks, ManagerArgs } from "./manager.js";
import { Manager } from "./manager.js";
import type { RequestData, RequestOptions } from "./types.js";
import { RequestMethod } from "./types.js";

// FIXME: Consider just one sweeper, and firing an empty event (or only sending the keys)

export default class Client {
	#manager: Manager;

	/**
	 * Creates a new Client for accessing the Discord API. This will
	 * automatically queue requests and handle rate limits.
	 * @param options - Configuration options for the Client.
	 * @returns The Client instance.
	 */
	constructor(options: ManagerArgs = {}) {
		this.#manager = new Manager(options);
	}

	/**
	 * Sets the Client's Bot Token.
	 * @param token - The Discord Bot Token.
	 * @returns The Client instance
	 */
	setToken(token: string) {
		this.#manager.setToken(token);
		return this;
	}

	/**
	 * Get whether the Client is currently sweeping buckets and queues.
	 */
	get isSweeping() {
		return this.#manager.isSweeping;
	}

	/**
	 * Get the Client's current User Agent.
	 */
	get userAgent() {
		return this.#manager.config.userAgent;
	}

	/**
	 * Sets the Client's User Agent. This needs to include information about
	 * the library and version being used to access the Discord API.
	 */
	set userAgent(value: string) {
		this.#manager.config.userAgent = `DiscordBot ${value}, discord-request v${pkg.version}`;
	}

	/**
	 * Get the Client's current abort signal. If this signal triggers, all
	 * pending requests will be aborted.
	 */
	get abortSignal() {
		return this.#manager.shutdownSignal;
	}

	/**
	 * Sets the Client's abort signal. If this signal triggers, all pending
	 * requests will be aborted.
	 */
	set abortSignal(signal: AbortSignal | null | undefined) {
		this.#manager.shutdownSignal = signal;
	}

	/**
	 * Returns the Client's current global requests per second.
	 */
	get globalRequestsPerSecond() {
		return this.#manager.config.globalRequestsPerSecond;
	}

	/**
	 * Sets the Client's global requests per second. You should not modify this
	 * unless you are a very large bot and have been approved for a higher rate
	 * limit by Discord. If you set this without Discord granting your bot a
	 * higher rate limit, you risk your bot being banned.
	 */
	set globalRequestsPerSecond(value: number) {
		this.#manager.config.globalRequestsPerSecond = value;
	}

	/**
	 * Get the Client's current Discord API configuration. This includes the API
	 * URL, the API Version, and the CDN URL.
	 */
	get api() {
		return {
			api: this.#manager.config.api,
			version: this.#manager.config.version,
			cdn: this.#manager.config.cdn,
		};
	}

	/**
	 * Sets the Client's Discord API configuration.
	 */
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

	/**
	 * Get the Client's current request configuration.
	 */
	get requestConfig() {
		return {
			headers: this.#manager.config.headers,
			retries: this.#manager.config.retries,
			timeout: this.#manager.config.timeout,
		};
	}

	/**
	 * Sets the Client's current request configuration. This allows setting
	 * global headers, request timeouts, and the retry count for a failed request.
	 */
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

	/**
	 * Get the Client sweep intervals. These help prevent memory leaks by
	 * periodically cleaning out unused, stored buckets and queues. In Edge and
	 * Serverless runtimes, these are not needed and should not be configured.
	 */
	get sweepIntervals() {
		return {
			bucketSweepInterval: this.#manager.bucketSweepInterval,
			queueSweepInterval: this.#manager.queueSweepInterval,
		};
	}

	/**
	 * Sets the Client sweep intervals. These help prevent memory leaks by
	 * periodically cleaning out unused, stored buckets and queues. In Edge and
	 * Serverless runtimes, these are not needed and should not be configured.
	 */
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

	/**
	 * Get the current client callbacks.
	 */
	get callbacks() {
		return {
			onBucketSweep: this.#manager.onBucketSweep,
			onQueueSweep: this.#manager.onQueueSweep,
			onRateLimit: this.#manager.onRateLimit,
			onRequest: this.#manager.onRequest,
		};
	}

	/**
	 * Sets the client callbacks.
	 */
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

	/**
	 * Sends an HTTP GET request to the Discord API.
	 * @param path - The Discord API path to send a request to.
	 * @param options - Request configuration options.
	 * @returns The Discord API response.
	 */
	async get(path: string, options: RequestOptions = {}) {
		return this.#request({
			path,
			method: RequestMethod.Get,
			...options,
		});
	}

	/**
	 * Sends an HTTP POST request to the Discord API.
	 * @param path - The Discord API path to send a request to.
	 * @param options - Request configuration options.
	 * @returns The Discord API response.
	 */
	async post(path: string, options: RequestOptions = {}) {
		return this.#request({
			path,
			method: RequestMethod.Post,
			...options,
		});
	}

	/**
	 * Sends an HTTP PUT request to the Discord API.
	 * @param path - The Discord API path to send a request to.
	 * @param options - Request configuration options.
	 * @returns The Discord API response.
	 */
	async put(path: string, options: RequestOptions = {}) {
		return this.#request({
			path,
			method: RequestMethod.Put,
			...options,
		});
	}

	/**
	 * Sends an HTTP PATCH request to the Discord API.
	 * @param path - The Discord API path to send a request to.
	 * @param options - Request configuration options.
	 * @returns The Discord API response.
	 */
	async patch(path: string, options: RequestOptions = {}) {
		return this.#request({
			path,
			method: RequestMethod.Patch,
			...options,
		});
	}

	/**
	 * Sends an HTTP DELETE request to the Discord API.
	 * @param path - The Discord API path to send a request to.
	 * @param options - Request configuration options.
	 * @returns The Discord API response.
	 */
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
