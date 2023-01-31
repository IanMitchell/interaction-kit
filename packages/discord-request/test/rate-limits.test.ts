import { describe, expect, test, vi } from "vitest";
import Client from "../src/client.js";
import { intercept } from "./util/mock-fetch.js";

describe("Buckets", () => {
	test.todo("Matches bucket if one exists");

	test.todo("Handles changed bucket hashes");
});

test.todo("Throttles Global Rate Limited requests");

test.todo("Throttles Local Rate Limited requests");

test.todo("Handles Rate Limit Chains");

test.todo("Handles Retry Headers");

test.todo("Handles Global Rate Limits");

test.todo("Updates Global Timeout Flag");

test.todo("Updates Global Limited Flag");

test.todo("Retries rate limited requests");

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
