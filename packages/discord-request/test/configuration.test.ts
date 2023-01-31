import { URLSearchParams } from "url";
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

	test("Handles Query Parameters", async () => {
		const client = new Client().setToken("test");

		const mock = getMockClient();
		mock.intercept({ path: "/api/v10/?key=value" }).reply(
			200,
			(request) => {
				const params = new URLSearchParams(request.path.split("?")[1]);

				return {
					params: [...params.entries()].reduce((acc, [key, value]) => {
						acc[key] = value;
						return acc;
					}, {}),
				};
			},
			{ headers: { "Content-Type": "application/json" } }
		);

		const response = await client.get("/", {
			query: new URLSearchParams({ key: "value" }),
		});
		expect(response.params).toEqual({ key: "value" });
	});

	test("Handles unversioned routes", async () => {
		const client = new Client({ version: 13 }).setToken("test");

		const mock = getMockClient();
		mock
			.intercept({ path: "/api/" })
			.reply(
				200,
				{ success: true },
				{ headers: { "Content-Type": "application/json" } }
			);

		const response = await client.get("/", { versioned: false });
		expect(response.success).toBe(true);
	});
});

describe("Headers", () => {
	test("Handles Authorization", async () => {
		const client = new Client().setToken("test");

		const mock = getMockClient();
		mock
			.intercept({ path: "/api/v10/" })
			.reply(200, (request) => ({ success: request.headers.authorization }), {
				headers: { "Content-Type": "application/json" },
			})
			.times(2);

		let response = await client.get("/", { auth: true });
		expect(response.success).toBe("Bot test");

		response = await client.get("/", {
			auth: true,
			authPrefix: "Bearer",
		});
		expect(response.success).toBe("Bearer test");
	});

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
