import { afterEach, beforeAll, describe, expect, test, vi } from "vitest";
import Client from "../src/client.js";

beforeAll(() => {
	vi.mock("../src/manager", () => {
		// There has to be a better way of doing this
		globalThis.CONSTRUCTOR_ARGS = null;
		globalThis.QUEUE_SPY = vi.fn();
		globalThis.TOKEN_SPY = vi.fn();

		const klass = class Manager {
			queue: unknown;
			setToken: unknown;
			config: Record<string, unknown>;

			constructor(args: unknown) {
				globalThis.CONSTRUCTOR_ARGS = args;
				this.config = {};

				this.queue = globalThis.QUEUE_SPY;
				this.setToken = globalThis.TOKEN_SPY;
			}
		};

		return { Manager: klass };
	});
});

afterEach(() => {
	vi.clearAllMocks();
});

describe("Configuration", () => {
	test("Constructor parameters are passed to Manager", () => {
		const client = new Client({
			api: "api",
			version: 2,
			cdn: "cdn",
			headers: { key: "value" },
			userAgent: "userAgent",
			retries: 3,
			timeout: 1,
			globalRequestsPerSecond: 0,
		});

		expect(globalThis.CONSTRUCTOR_ARGS).toEqual({
			api: "api",
			version: 2,
			cdn: "cdn",
			headers: { key: "value" },
			userAgent: "userAgent",
			retries: 3,
			timeout: 1,
			globalRequestsPerSecond: 0,
		});
	});

	test("setToken", () => {
		const client = new Client();
		client.setToken("token");
		expect(globalThis.TOKEN_SPY).toHaveBeenCalledWith("token");
	});

	test("userAgent", () => {
		const client = new Client();
		client.userAgent = "test UA";
		expect(client.userAgent).toEqual("test UA");
	});

	test("abortSignal", () => {
		const client = new Client();
		const controller = new AbortController();

		client.abortSignal = controller.signal;
		expect(client.abortSignal).toBe(controller.signal);
	});

	test("globalRequestsPerSecond", () => {
		const client = new Client();
		client.globalRequestsPerSecond = 1;
		expect(client.globalRequestsPerSecond).toEqual(1);
	});

	test("api", () => {
		const client = new Client();
		client.api = {
			api: "apiOverride",
			version: 1,
			cdn: "cdnOverride",
		};
		expect(client.api).toEqual({
			api: "apiOverride",
			version: 1,
			cdn: "cdnOverride",
		});
	});

	test("requestConfig", () => {
		const client = new Client();
		client.requestConfig = {
			headers: { test: "vitest" },
			retries: 1,
			timeout: 1,
		};
		expect(client.requestConfig).toEqual({
			headers: { test: "vitest" },
			retries: 1,
			timeout: 1,
		});
	});

	test("sweepIntervals", () => {
		const client = new Client();
		client.sweepIntervals = {
			bucketSweepInterval: 31,
			queueSweepInterval: 31,
		};
		expect(client.sweepIntervals).toEqual({
			bucketSweepInterval: 31,
			queueSweepInterval: 31,
		});
	});

	test("callbacks", () => {
		const onBucketSweep = () => {
			console.log("bucket sweep");
		};

		const onQueueSweep = () => {
			console.log("queue sweep");
		};

		const onRateLimit = () => {
			console.log("rate limit");
		};

		const onRequest = () => {
			console.log("request");
		};

		const client = new Client();
		client.callbacks = {
			onBucketSweep,
			onQueueSweep,
			onRateLimit,
			onRequest,
		};

		expect(client.callbacks).toEqual({
			onBucketSweep,
			onQueueSweep,
			onRateLimit,
			onRequest,
		});
	});
});

describe("HTTP Methods", () => {
	test("Handles GET requests", async () => {
		const client = new Client();
		await client.get("/get", {
			query: new URLSearchParams([["key", "value"]]),
		});

		expect(globalThis.QUEUE_SPY).toHaveBeenCalledWith({
			method: "GET",
			path: "/get",
			query: new URLSearchParams([["key", "value"]]),
		});
	});

	test("Handles POST requests", async () => {
		const client = new Client();
		await client.post("/post", {
			body: { key: "value" },
		});

		expect(globalThis.QUEUE_SPY).toHaveBeenCalledWith({
			method: "POST",
			path: "/post",
			body: { key: "value" },
		});
	});

	test("Handles PUT requests", async () => {
		const client = new Client();
		await client.put("/put", {
			body: { key: "value" },
		});

		expect(globalThis.QUEUE_SPY).toHaveBeenCalledWith({
			method: "PUT",
			path: "/put",
			body: { key: "value" },
		});
	});

	test("Handles PATCH requests", async () => {
		const client = new Client();
		await client.patch("/patch", {
			body: { key: "value" },
		});

		expect(globalThis.QUEUE_SPY).toHaveBeenCalledWith({
			method: "PATCH",
			path: "/patch",
			body: { key: "value" },
		});
	});

	test("Handles DELETE requests", async () => {
		const client = new Client();
		await client.delete("/delete", {
			body: { key: "value" },
		});

		expect(globalThis.QUEUE_SPY).toHaveBeenCalledWith({
			method: "DELETE",
			path: "/delete",
			body: { key: "value" },
		});
	});
});
