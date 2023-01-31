import { describe, expect, test, vi } from "vitest";
import Client from "../src/client.js";
import { getMockClient, setMockResponse } from "./util/mock-fetch.js";

describe("Sweeps", () => {
	test.todo("Sweeps don't start with Interval 0");

	test.todo("Old buckets are removed and returned");

	test.todo("Sweeps can be cleared");
});

describe("API URL", () => {
	test("Handles old API versions", async () => {
		const client = new Client({ version: 6 }).setToken("test");

		const mock = getMockClient();
		mock
			.intercept({ path: "/api/v6/" })
			.reply(
				200,
				{ success: true },
				{ headers: { "Content-Type": "application/json" } }
			);

		const response = await client.get("/");
		expect(response.success).toBe(true);
	});

	test.todo("Handles Query Parameters");

	test.todo("Handles unversioned routes");
});

describe("Headers", () => {
	test.todo("Handles Authorization");

	test("Handles Audit Log", async () => {
		const onRequest = vi.fn();
		const client = new Client({ onRequest }).setToken("test");

		setMockResponse({ status: 200, body: { success: true }, method: "POST" });
		await client.post("/", { reason: "Mods, ban this user" });

		const headers = new Headers(onRequest.mock.calls[0][2].headers);
		expect(headers.get("X-Audit-Log-Reason")).toEqual(
			"Mods%2C%20ban%20this%20user"
		);
	});
});
