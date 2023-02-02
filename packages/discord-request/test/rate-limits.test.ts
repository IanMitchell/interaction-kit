import { performance } from "node:perf_hooks";
import { expect, test, vi } from "vitest";
import Client from "../src/client.js";
import { intercept } from "./util/mock-fetch.js";

test.todo("Throttles Global Rate Limited requests");

test.todo("Throttles Local Rate Limited requests");

test("Handles Rate Limited Queues", async () => {
	const client = new Client().setToken("test");

	intercept("/rate-limit-queue").reply(
		429,
		{},
		{
			headers: {
				"X-RateLimit-Limit": "5",
				"X-RateLimit-Remaining": "0",
				"X-RateLimit-Reset-After": "2",
				"X-RateLimit-Reset": (Date.now() / 1000 + 2).toString(),
				"X-RateLimit-Bucket": "global",
			},
		}
	);

	intercept("/rate-limit-queue")
		.reply(
			200,
			{ success: true },
			{ headers: { "Content-Type": "application/json" } }
		)
		.times(2);

	const [first, second] = await Promise.all([
		client.get("/rate-limit-queue"),
		client.get("/rate-limit-queue"),
	]);

	expect(first).toEqual({ success: true });
	expect(second).toEqual({ success: true });
});

test("Follows Retry Headers", async () => {
	const client = new Client().setToken("test");

	intercept("/rate-limit-headers").reply(
		429,
		{},
		{
			headers: {
				"X-RateLimit-Limit": "5",
				"X-RateLimit-Remaining": "0",
				"X-RateLimit-Reset-After": "2",
				"X-RateLimit-Reset": (Date.now() / 1000 + 2).toString(),
				"X-RateLimit-Bucket": "global",
			},
		}
	);

	intercept("/rate-limit-headers").reply(
		200,
		{ success: true },
		{ headers: { "Content-Type": "application/json" } }
	);

	const start = performance.now();
	const response = await client.get("/rate-limit-headers");
	const end = performance.now();

	expect(end - start).toBeGreaterThanOrEqual(2000);
	expect(response).toEqual({ success: true });
});

test.todo("Handles Global Rate Limits");

test.todo("Updates Global Timeout Flag");

test.todo("Updates Global Limited Flag");

test("Retries rate limited requests", async () => {
	const client = new Client().setToken("test");

	intercept("/rate-limit-retry").reply(
		429,
		{},
		{
			headers: {
				"X-RateLimit-Limit": "5",
				"X-RateLimit-Remaining": "0",
				"X-RateLimit-Reset-After": "2",
				"X-RateLimit-Reset": (Date.now() / 1000 + 2).toString(),
				"X-RateLimit-Bucket": "global",
			},
		}
	);

	intercept("/rate-limit-retry").reply(
		200,
		{ success: true },
		{ headers: { "Content-Type": "application/json" } }
	);

	const response = await client.get("/rate-limit-retry");

	expect(response).toEqual({ success: true });
});

test("Can ignore global rate limit", async () => {
	const onRateLimit = vi.fn();

	const client = new Client({
		globalRequestsPerSecond: 1,
		onRateLimit,
	}).setToken("test");

	intercept("/ignore-global-rl").reply(200, { success: true }).times(3);

	const [first, second, third] = await Promise.all([
		client.get("/ignore-global-rl", { ignoreGlobalLimit: true }),
		client.get("/ignore-global-rl", { ignoreGlobalLimit: true }),
		client.get("/ignore-global-rl", { ignoreGlobalLimit: true }),
	]);

	expect(onRateLimit).not.toHaveBeenCalled();
});
