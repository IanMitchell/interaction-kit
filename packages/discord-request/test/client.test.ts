import { expect, test } from "vitest";
import pkg from "../package.json";
import Client from "../src/client.js";

test("isSweeping", () => {
	const client = new Client({
		queueSweepInterval: 0,
		bucketSweepInterval: 0,
	});

	expect(client.isSweeping).toEqual(false);

	client.sweepIntervals = {
		queueSweepInterval: 1,
		bucketSweepInterval: 0,
	};

	expect(client.isSweeping).toEqual(true);

	client.sweepIntervals = {
		queueSweepInterval: 1,
		bucketSweepInterval: 1,
	};

	expect(client.isSweeping).toEqual(true);

	client.sweepIntervals = {
		queueSweepInterval: 0,
		bucketSweepInterval: 1,
	};

	expect(client.isSweeping).toEqual(true);

	client.sweepIntervals = {
		queueSweepInterval: 0,
		bucketSweepInterval: 0,
	};

	expect(client.isSweeping).toEqual(false);
});

test("userAgent", () => {
	const client = new Client();
	client.userAgent = "test UA";
	expect(client.userAgent).toEqual(
		`DiscordBot test UA, discord-request v${pkg.version}`
	);
});

test("abortSignal", () => {
	const client = new Client();
	const controller = new AbortController();

	client.abortSignal = controller.signal;
	expect(client.abortSignal).toBe(controller.signal);
});

test("globalRequestsPerSecond", () => {
	const client = new Client();
	client.globalRequestsPerSecond = 1;
	expect(client.globalRequestsPerSecond).toEqual(1);
});

test("api", () => {
	const client = new Client();
	client.api = {
		api: "apiOverride",
		version: 1,
		cdn: "cdnOverride",
	};
	expect(client.api).toEqual({
		api: "apiOverride",
		version: 1,
		cdn: "cdnOverride",
	});
});

test("requestConfig", () => {
	const client = new Client();
	client.requestConfig = {
		headers: { test: "vitest" },
		retries: 1,
		timeout: 1,
	};
	expect(client.requestConfig).toEqual({
		headers: { test: "vitest" },
		retries: 1,
		timeout: 1,
	});
});

test("sweepIntervals", () => {
	const client = new Client();
	client.sweepIntervals = {
		bucketSweepInterval: 31,
		queueSweepInterval: 31,
	};
	expect(client.sweepIntervals).toEqual({
		bucketSweepInterval: 31,
		queueSweepInterval: 31,
	});
});

test("callbacks", () => {
	const onBucketSweep = () => {
		console.log("bucket sweep");
	};

	const onQueueSweep = () => {
		console.log("queue sweep");
	};

	const onRateLimit = () => {
		console.log("rate limit");
	};

	const onRequest = () => {
		console.log("request");
	};

	const client = new Client();
	client.callbacks = {
		onBucketSweep,
		onQueueSweep,
		onRateLimit,
		onRequest,
	};

	expect(client.callbacks).toEqual({
		onBucketSweep,
		onQueueSweep,
		onRateLimit,
		onRequest,
	});
});
