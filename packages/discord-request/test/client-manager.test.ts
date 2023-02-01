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
