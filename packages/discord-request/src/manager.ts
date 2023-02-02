import debug from "debug";
import pkg from "../package.json" assert { type: "json" };
import { Queue } from "./queue.js";
import type { RateLimitData, RequestData, Route } from "./types.js";
import { getRouteInformation, getRouteKey } from "./util/routes.js";
import { OFFSET, ONE_DAY, ONE_SECOND, sleep } from "./util/time.js";

const log = debug("discord-request:manager");

type Bucket = {
	key: string;
	lastRequest: number;
};

export type Config = {
	api: string;
	cdn: string;
	headers: Record<string, string>;
	retries: number;
	timeout: number;
	userAgent: string;
	version: number;
	globalRequestsPerSecond: number;
};

export type Callbacks = {
	onBucketSweep?: (swept: Map<string, Bucket>) => void;
	onQueueSweep?: (swept: Set<string>) => void;
	onRateLimit?: (data: RateLimitData) => void;
	onRequest?: (
		parameters: Route,
		resource: string,
		init: RequestInit,
		retries: number
	) => void;
};

type Cache = {
	shutdownSignal?: AbortSignal;
	queueSweepInterval?: number;
	bucketSweepInterval?: number;
};

export type ManagerArgs = Partial<Config> & Cache & Callbacks;

export class Manager {
	#token: string | null = null;
	shutdownSignal: AbortSignal | null | undefined;
	config: Config;

	globalDelay: Promise<void> | null = null;
	globalReset = -1;
	globalRequestCounter: number;

	buckets: Map<string, Bucket>;
	queues: Map<string, Queue>;

	#bucketSweeper = -1;
	#queueSweeper = -1;

	#bucketSweepInterval: number;
	#queueSweepInterval: number;

	onBucketSweep: Callbacks["onBucketSweep"] | undefined;
	onQueueSweep: Callbacks["onQueueSweep"] | undefined;
	onRateLimit: Callbacks["onRateLimit"] | undefined;
	onRequest: Callbacks["onRequest"] | undefined;

	constructor({
		// Request Config
		api,
		version,
		cdn,
		headers,
		userAgent,
		retries,
		timeout,
		globalRequestsPerSecond,
		// Manager Options
		shutdownSignal,
		onBucketSweep,
		onQueueSweep,
		bucketSweepInterval,
		queueSweepInterval,
		onRateLimit,
		onRequest,
	}: ManagerArgs) {
		this.config = {
			api: api ?? "https://discord.com/api",
			version: version ?? 10,
			cdn: cdn ?? "https://cdn.discordapp.com",
			headers: headers ?? {},
			userAgent: userAgent ?? `DiscordBot discord-request v${pkg.version}`,
			retries: retries ?? 3,
			timeout: timeout ?? 15 * ONE_SECOND,
			globalRequestsPerSecond: globalRequestsPerSecond ?? 50,
		};

		this.buckets = new Map();
		this.queues = new Map();

		this.globalRequestCounter = this.config.globalRequestsPerSecond;

		this.#bucketSweepInterval = bucketSweepInterval ?? 0;
		this.#queueSweepInterval = queueSweepInterval ?? 0;
		this.onBucketSweep = onBucketSweep;
		this.onQueueSweep = onQueueSweep;
		this.onRateLimit = onRateLimit;
		this.onRequest = onRequest;

		this.shutdownSignal = shutdownSignal;
		this.shutdownSignal?.addEventListener("abort", this.shutdown.bind(this));

		this.startSweepers();
	}

	get globalTimeout() {
		return this.globalReset + OFFSET - Date.now();
	}

	get isSweeping() {
		return this.#bucketSweeper !== 0 || this.#queueSweeper !== 0;
	}

	get bucketSweepInterval() {
		return this.#bucketSweepInterval;
	}

	set bucketSweepInterval(interval: number) {
		this.#bucketSweepInterval = interval;
		this.#startBucketSweep();
	}

	get queueSweepInterval() {
		return this.#queueSweepInterval;
	}

	set queueSweepInterval(interval: number) {
		this.#queueSweepInterval = interval;
		this.#startQueueSweep();
	}

	startSweepers() {
		this.#startBucketSweep();
		this.#startQueueSweep();
	}

	async queue(data: RequestData) {
		const route = getRouteInformation(data.path);
		const routeKey = getRouteKey(data.method, route);
		const bucket = this.#getBucket(routeKey);

		// FIXME: add a mapping of method, route path, and route id to a queue
		// this should start without caring about method if no queue exists
		// when a request returns with a different bucket, then the method matters
		//
		// right now, I am not checking the method, so requests made with different
		// methods are all grouped into the same queue, when they could potentially
		// be separated for better throughput
		//
		// New system should be:
		// Map<{constructed key of method||global, route path, route id}, hash> -> Map<hash, Queue>
		const queue = this.#getBucketQueue(bucket, route.identifier);

		const { resource, init, ignoreGlobalLimit } = this.#resolve(data);

		return queue.add(route, resource, init, ignoreGlobalLimit);
	}

	setToken(token: string | null) {
		this.#token = token;
		return this;
	}

	async setGlobalDelay(retryAfter: number) {
		this.globalDelay = sleep(retryAfter, this.shutdownSignal).then(() => {
			this.globalDelay = null;
		});

		return this.globalDelay;
	}

	setShutdownSignal(signal: AbortSignal) {
		this.shutdownSignal?.removeEventListener("abort", this.shutdown.bind(this));
		this.shutdownSignal = signal;
		this.shutdownSignal.addEventListener("abort", this.shutdown.bind(this));
	}

	shutdown() {
		this.clearBucketSweeper();
		this.clearQueueSweeper();
	}

	clearBucketSweeper() {
		clearInterval(this.#bucketSweeper);
	}

	clearQueueSweeper() {
		clearInterval(this.#queueSweeper);
	}

	isGlobalLimited() {
		return this.globalRequestCounter <= 0 && Date.now() < this.globalReset;
	}

	#startBucketSweep() {
		if (this.bucketSweepInterval === 0) {
			clearInterval(this.#bucketSweeper);
			this.#bucketSweeper = 0;
			return;
		}

		this.#bucketSweeper = setInterval(() => {
			const swept = new Map<string, Bucket>();

			for (const [key, bucket] of this.buckets.entries()) {
				if (bucket.lastRequest === -1) {
					continue;
				}

				if (Math.floor(Date.now() - bucket.lastRequest) > ONE_DAY) {
					swept.set(key, bucket);
					log(`Swept the ${key} bucket`);
					this.buckets.delete(key);
				}
			}

			this.onBucketSweep?.(swept);
		}, this.bucketSweepInterval);
	}

	#startQueueSweep() {
		if (this.queueSweepInterval === 0) {
			clearInterval(this.#queueSweeper);
			this.#queueSweeper = 0;
			return;
		}

		this.#queueSweeper = setInterval(() => {
			const swept = new Set<string>();

			for (const [key, queue] of this.queues.entries()) {
				if (queue.inactive) {
					log(`Swept the ${key} queue`);
					swept.add(key);
					this.queues.delete(key);
				}
			}

			this.onQueueSweep?.(swept);
		}, this.queueSweepInterval);
	}

	#getBucket(routeKey: string) {
		if (this.buckets.has(routeKey)) {
			return this.buckets.get(routeKey)!;
		}

		return {
			key: `Global(${routeKey})`,
			lastRequest: -1,
		};
	}

	#getBucketQueue(bucket: Bucket, primaryId: string) {
		const key = `${bucket.key}:${primaryId}`;

		if (this.queues.has(key)) {
			return this.queues.get(key)!;
		}

		return this.#createQueue(key);
	}

	#createQueue(key: string) {
		const queue = new Queue(this, key, this.shutdownSignal);
		this.queues.set(key, queue);

		return queue;
	}

	#resolve(data: RequestData) {
		const url = this.#getRequestURL(data);
		const headers = this.#getRequestHeaders(data);
		let body: RequestInit["body"];

		if (data.files != null) {
			headers.set("Content-Type", "multipart/form-data");
			const formData = new FormData();

			for (const [index, file] of data.files.entries()) {
				let { data } = file;

				if (!(data instanceof Blob)) {
					data = new Blob(data);
				}

				formData.append(`files[${file.id ?? index}]`, data, file.name);
			}

			if (data.formData != null) {
				for (const [key, value] of data.formData.entries()) {
					if (typeof value === "string") {
						formData.append(key, value);
					} else {
						formData.append(key, value, value.name);
					}
				}
			}

			if (data.body != null) {
				formData.append("payload_json", JSON.stringify(data.body));
			}

			body = formData;
		} else if (data.body != null) {
			if (data.rawBody) {
				body = data.body as BodyInit;
			} else {
				headers.set("Content-Type", "application/json");
				body = JSON.stringify(data.body);
			}
		}

		const fetchOptions: RequestInit = {
			method: data.method,
			headers,
			body: body ?? null,
		};

		return {
			resource: url,
			init: fetchOptions,
			ignoreGlobalLimit: data.ignoreGlobalLimit ?? false,
		};
	}

	#getRequestURL(data: RequestData) {
		let url = this.config.api;

		if (data.versioned !== false) {
			url += `/v${this.config.version}`;
		}

		url += data.path;

		const query = data.query?.toString();
		if (query && query !== "") {
			url += `?${query}`;
		}

		return url;
	}

	#getRequestHeaders(data: RequestData) {
		const headers = new Headers(this.config.headers);
		headers.set("User-Agent", this.config.userAgent.trim());

		if (data.auth !== false) {
			if (!this.#token) {
				throw new Error(
					"Expected token to be set for this request, but none was present"
				);
			}

			headers.set(
				"Authorization",
				`${data.authPrefix ?? "Bot"} ${this.#token}`
			);
		}

		if (data.reason != null) {
			headers.set("X-Audit-Log-Reason", encodeURIComponent(data.reason));
		}

		return headers;
	}
}
