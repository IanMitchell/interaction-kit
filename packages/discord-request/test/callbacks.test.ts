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

test("Executes onRateLimit", async () => {
	setMockResponse({
		status: 429,
		body: {},
		headers: {
			"X-RateLimit-Limit": "5",
			"X-RateLimit-Remaining": "0",
			"X-RateLimit-Reset-After": "2",
			"X-RateLimit-Reset": "1470173023",
			"X-RateLimit-Bucket": "global",
		},
	})
		.intercept({ path: "/api/v10/", method: "GET" })
		.reply(200, { success: true });
	const onRateLimit = vi.fn();

	const client = new Client({
		onRateLimit,
	}).setToken("test");

	await client.get("/");

	expect(onRateLimit).toHaveBeenCalledWith({
		retryAfter: 0,
		limit: 5,
		bucket: "Global(GET:/):global",
		url: "https://discord.com/api/v10/",
		route: "/",
		identifier: "global",
		global: false,
		method: "GET",
	});
});
