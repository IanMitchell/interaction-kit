import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import Client from "../src/client.js";

describe("Configuration", () => {
	test.todo("setToken");

	test.todo("userAgent");

	test.todo("abortSignal");

	test.todo("globalRequestsPerSecond");

	test.todo("api");

	test.todo("requestConfig");

	test.todo("sweepIntervals");

	test.todo("callbacks");
});

describe("HTTP Methods", () => {
	beforeEach(() => {
		vi.mock("../src/manager", () => {
			// TODO: There has to be a better way of doing this
			globalThis.SPY = vi.fn();

			const klass = class Manager {
				queue: unknown;

				constructor() {
					this.queue = globalThis.SPY;
				}
			};

			return { Manager: klass };
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	test("Handles GET requests", async () => {
		const client = new Client();
		await client.get("/get", {
			query: new URLSearchParams([["key", "value"]]),
		});

		expect(globalThis.SPY).toHaveBeenCalledWith({
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

		expect(globalThis.SPY).toHaveBeenCalledWith({
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

		expect(globalThis.SPY).toHaveBeenCalledWith({
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

		expect(globalThis.SPY).toHaveBeenCalledWith({
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

		expect(globalThis.SPY).toHaveBeenCalledWith({
			method: "DELETE",
			path: "/delete",
			body: { key: "value" },
		});
	});
});
