import { expect, test, vi } from "vitest";
import Client from "../src/client.js";
import { setMockResponse } from "./util/mock-fetch.js";

test("Executes onRequest", async () => {
	setMockResponse({ status: 200, body: { success: true } });
	const onRequest = vi.fn();

	const client = new Client({
		onRequest,
	}).setToken("test");

	await client.get("/");

	expect(onRequest).toHaveBeenCalledWith(
		{
			identifier: "global",
			path: "/",
		},
		"https://discord.com/api/v10/",
		expect.objectContaining({
			body: null,
			method: "GET",
		}),
		0
	);
});

test.todo("Executs onRateLimit");
