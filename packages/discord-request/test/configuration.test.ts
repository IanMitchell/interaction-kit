import { URLSearchParams } from "node:url";
import { describe, expect, test, vi } from "vitest";
import { Client } from "../src/client.js";
import { intercept, mockPool } from "./util/mock-fetch.js";

describe("API URL", () => {
	test("Handles old API versions", async () => {
		const client = new Client({ version: 6 });
		client.setToken("test");

		mockPool
			.intercept({ path: "/api/v6/oldie-but-still-slaps" })
			.reply(
				200,
				{ success: true },
				{ headers: { "Content-Type": "application/json" } }
			);

		const response = (await client.get("/oldie-but-still-slaps")) as Record<
			string,
			unknown
		>;
		expect(response.success).toBe(true);
	});

	test("Handles Query Parameters", async () => {
		const client = new Client();
		client.setToken("test");

		intercept("/params?key=value").reply(
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

		const response = (await client.get("/params", {
			query: new URLSearchParams({ key: "value" }),
		})) as Record<string, unknown>;
		expect(response.params).toEqual({ key: "value" });
	});

	test("Handles unversioned routes", async () => {
		const client = new Client({ version: 13 });
		client.setToken("test");

		mockPool
			.intercept({ path: "/api/concise" })
			.reply(
				200,
				{ success: true },
				{ headers: { "Content-Type": "application/json" } }
			);

		const response = (await client.get("/concise", {
			versioned: false,
		})) as Record<string, unknown>;
		expect(response.success).toBe(true);
	});
});

describe("Headers", () => {
	test("Handles Authorization", async () => {
		const client = new Client();
		client.setToken("test");

		intercept("/authorization")
			.reply(
				200,
				(request) => {
					const value = (request.headers as Record<string, unknown>)
						.authorization;
					return { success: value };
				},
				{
					headers: { "Content-Type": "application/json" },
				}
			)
			.times(2);

		let response = (await client.get("/authorization", {
			authorization: true,
		})) as Record<string, unknown>;
		expect(response.success).toBe("Bot test");

		response = (await client.get("/authorization", {
			authorization: true,
			authorizationPrefix: "Bearer",
		})) as Record<string, unknown>;
		expect(response.success).toBe("Bearer test");
	});

	test("Handles Audit Log", async () => {
		const onRequest = vi.fn();
		const client = new Client({ onRequest });
		client.setToken("test");

		intercept("/audit-log", { method: "POST" }).reply(
			200,
			{ success: true },
			{ headers: { "Content-Type": "application/json" } }
		);

		await client.post("/audit-log", { reason: "Mods, ban this user" });

		const headers = new Headers(onRequest.mock.calls[0][2].headers);
		expect(headers.get("X-Audit-Log-Reason")).toEqual(
			"Mods%2C%20ban%20this%20user"
		);
	});
});
