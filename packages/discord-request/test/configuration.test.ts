import { URLSearchParams } from "node:url";
import { describe, expect, test, vi } from "vitest";
import Client from "../src/client.js";
import { intercept, mockPool } from "./util/mock-fetch.js";
import { wait } from "./util/wait.js";

vi.mock("../src/util/time", () => ({
	OFFSET: 50,
	ONE_HOUR: 200,
	ONE_DAY: 300,
}));

describe("Sweeps", () => {
	test("Can sweep without callbacks", async () => {
		const client = new Client({
			bucketSweepInterval: 100,
			queueSweepInterval: 100,
		}).setToken("test");

		await wait(350);

		// TODO: Somehow measure dead queues and see that they've been removed
	});

	// This test is not great, but I'm not quite sure how to test this in a better way
	test("Sweeps don't start with Interval 0", async () => {
		const onBucketSweep = vi.fn();
		const onQueueSweep = vi.fn();

		const client = new Client({
			bucketSweepInterval: 0,
			onBucketSweep,
			queueSweepInterval: 0,
			onQueueSweep,
		}).setToken("test");

		await wait(50);
		expect(client.isSweeping).toBe(false);
	});

	test("Sweeps run when configured", async () => {
		const onBucketSweep = vi.fn();
		const onQueueSweep = vi.fn();

		const client = new Client({
			bucketSweepInterval: 100,
			onBucketSweep,
			queueSweepInterval: 100,
			onQueueSweep,
		}).setToken("test");

		await wait(350);

		expect(onBucketSweep).toHaveBeenCalledTimes(3);
		expect(onQueueSweep).toHaveBeenCalledTimes(3);
	});

	test("Old buckets and queues are removed and returned", async () => {
		const onBucketSweep = vi.fn();
		const onQueueSweep = vi.fn();

		const client = new Client({
			bucketSweepInterval: 400,
			onBucketSweep,
			queueSweepInterval: 400,
			onQueueSweep,
		}).setToken("test");

		// Three requests to different buckets
		intercept("/webhooks/1234567890123456").reply(
			200,
			{ success: true },
			{
				headers: {
					"Content-Type": "application/json",
					"X-RateLimit-Bucket": "bucket1",
				},
			}
		);
		intercept("/channels/1234567890123457")
			.reply(
				200,
				{ success: true },
				{
					headers: {
						"Content-Type": "application/json",
						"X-RateLimit-Bucket": "bucket2",
					},
				}
			)
			.times(2);

		await client.get("/webhooks/1234567890123456");
		await client.get("/channels/1234567890123457");

		// Delay to avoid sweep
		await wait(200);
		await client.get("/channels/1234567890123457");

		await wait(250);

		console.log({ onQueueSweep: onQueueSweep.mock.calls });

		expect(onBucketSweep).toHaveBeenLastCalledWith(
			new Map([
				[
					"GET:/webhooks/:id",
					{ key: "bucket1", lastRequest: expect.any(Number) },
				],
			])
		);
		expect(onQueueSweep).toHaveBeenLastCalledWith(
			new Set([
				"Global(GET:/webhooks/:id):1234567890123456",
				"Global(GET:/channels/:id):1234567890123457",
				"bucket1:1234567890123456",
			])
		);
	});

	test("Abort signal clears sweeps", async () => {
		const onBucketSweep = vi.fn();
		const onQueueSweep = vi.fn();
		const abort = new AbortController();

		const client = new Client({
			bucketSweepInterval: 100,
			queueSweepInterval: 100,
			onBucketSweep,
			onQueueSweep,
			shutdownSignal: abort.signal,
		}).setToken("test");

		abort.abort();
		await wait(350);

		expect(onBucketSweep).not.toHaveBeenCalled();
		expect(onQueueSweep).not.toHaveBeenCalled();
	});
});

describe("Buckets", () => {
	test("Matches bucket if one exists", async () => {
		const onBucketSweep = vi.fn();

		const client = new Client({
			bucketSweepInterval: 400,
			onBucketSweep,
		}).setToken("test");

		intercept("/webhooks/1234567890123456").reply(
			200,
			{ success: true },
			{
				headers: {
					"Content-Type": "application/json",
					"X-RateLimit-Bucket": "bucket1",
				},
			}
		);
		intercept("/webhooks/1234567890123457").reply(
			200,
			{ success: true },
			{
				headers: {
					"Content-Type": "application/json",
					"X-RateLimit-Bucket": "bucket1",
				},
			}
		);

		await client.get("/webhooks/1234567890123456");
		await client.get("/webhooks/1234567890123457");
		await wait(450);

		expect(onBucketSweep).toHaveBeenCalledWith(
			new Map([
				[
					"GET:/webhooks/:id",
					{ key: "bucket1", lastRequest: expect.any(Number) },
				],
			])
		);
	});

	test("Handles changed bucket hashes", async () => {
		const onBucketSweep = vi.fn();

		const client = new Client({
			bucketSweepInterval: 400,
			onBucketSweep,
		}).setToken("test");

		intercept("/webhooks/1234567890123456").reply(
			200,
			{ success: true },
			{
				headers: {
					"Content-Type": "application/json",
					"X-RateLimit-Bucket": "bucket1",
				},
			}
		);
		intercept("/webhooks/1234567890123456").reply(
			200,
			{ success: true },
			{
				headers: {
					"Content-Type": "application/json",
					"X-RateLimit-Bucket": "bucket2",
				},
			}
		);

		await client.get("/webhooks/1234567890123456");
		await wait(100);
		await client.get("/webhooks/1234567890123456");
		await wait(350);

		// Buckets are an in place swap, so we don't expect cleanup
		expect(onBucketSweep).toHaveBeenCalledWith(new Map());
	});
});

describe("API URL", () => {
	test("Handles old API versions", async () => {
		const client = new Client({ version: 6 }).setToken("test");

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
		const client = new Client().setToken("test");

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
		const client = new Client({ version: 13 }).setToken("test");

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
		const client = new Client().setToken("test");

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
			auth: true,
		})) as Record<string, unknown>;
		expect(response.success).toBe("Bot test");

		response = (await client.get("/authorization", {
			auth: true,
			authPrefix: "Bearer",
		})) as Record<string, unknown>;
		expect(response.success).toBe("Bearer test");
	});

	test("Handles Audit Log", async () => {
		const onRequest = vi.fn();
		const client = new Client({ onRequest }).setToken("test");

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
