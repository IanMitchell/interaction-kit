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
	let spy;

	beforeEach(() => {
		spy = vi.fn();

		vi.mock("../src/manager", () => {
			const klass = class Manager {
				queue: unknown;

				constructor() {
					this.queue = spy;
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

		expect(spy).toHaveBeenCalledWith(
			"/get",
			{ query: new URLSearchParams([["key", "value"]]) },
			"GET"
		);
	});

	test.todo("Handles POST requests");

	test.todo("Handles PUT requests");

	test.todo("Handles PATCH requests");

	test.todo("Handles DELETE requests");
});
