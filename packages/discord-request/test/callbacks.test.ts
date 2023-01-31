import { expect, test, vi } from "vitest";
import Client from "../src/client.js";
import { intercept } from "./util/mock-fetch.js";

test("Executes onRequest", async () => {
	const onRequest = vi.fn();

	const client = new Client({
		onRequest,
	}).setToken("test");

	intercept("/onRequest").reply(
		200,
		{ success: true },
		{ headers: { "Content-Type": "application/json" } }
	);

	await client.get("/onRequest");

	expect(onRequest).toHaveBeenCalledWith(
		{
			identifier: "global",
			path: "/onRequest",
		},
		"https://discord.com/api/v10/onRequest",
		expect.objectContaining({
			body: null,
			method: "GET",
		}),
		0
	);
});

test("Executes onRateLimit", async () => {
	intercept("/onRateLimit").reply(
		429,
		{},
		{
			headers: {
				"X-RateLimit-Limit": "5",
				"X-RateLimit-Remaining": "0",
				"X-RateLimit-Reset-After": "2",
				"X-RateLimit-Reset": "1470173023",
				"X-RateLimit-Bucket": "global",
			},
		}
	);

	intercept("/onRateLimit").reply(
		200,
		{ success: true },
		{ headers: { "Content-Type": "application/json" } }
	);

	const onRateLimit = vi.fn();

	const client = new Client({
		onRateLimit,
	}).setToken("test");

	await client.get("/onRateLimit");

	expect(onRateLimit).toHaveBeenCalledWith({
		retryAfter: 0,
		limit: 5,
		bucket: "Global(GET:/onRateLimit):global",
		url: "https://discord.com/api/v10/onRateLimit",
		route: "/onRateLimit",
		identifier: "global",
		global: false,
		method: "GET",
	});
});
