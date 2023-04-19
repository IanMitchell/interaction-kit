import { expect, test } from "vitest";
import pkg from "../package.json";
import { Client } from "../src/client.js";

/**
 * This file is mostly testing our API for backwards compatibility
 */

test("constructor", () => {
	const client = new Client({
		api: "api",
		version: 1,
		cdn: "cdn",
		headers: {
			"test-header": "test",
		},
		userAgent: "test UA",
		timeout: 1000,
		// Manager Options
		abortSignal: new AbortController().signal,
		onRequest: () => {
			console.log("request");
		},
	});
	expect(client).toBeDefined();
});

test("setToken", () => {
	const client = new Client();
	expect(client.setToken).toBeDefined();
});

test("userAgent", () => {
	const client = new Client();
	client.userAgent = "test UA";
	expect(client.userAgent).toEqual(
		`DiscordBot (https://github.com/ianmitchell/interaction-kit, v${pkg.version}) test UA`
	);
});

test("abortSignal", () => {
	const client = new Client();
	const controller = new AbortController();

	client.abortSignal = controller.signal;
	expect(client.abortSignal).toBe(controller.signal);
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

test("headers", () => {
	const client = new Client();
	client.headers = {
		"test-header": "test",
	};
	expect(client.headers).toEqual({
		"test-header": "test",
	});
});

test("timeout", () => {
	const client = new Client();
	client.timeout = 1000;
	expect(client.timeout).toEqual(1000);
});

test("callbacks", () => {
	const onRequest = () => {
		console.log("request");
	};

	const client = new Client();
	client.onRequest = onRequest;

	expect(client.onRequest).toEqual(onRequest);
});

test("HTTP Methods", () => {
	const client = new Client();
	expect(client.get).toBeDefined();
	expect(client.post).toBeDefined();
	expect(client.patch).toBeDefined();
	expect(client.put).toBeDefined();
	expect(client.delete).toBeDefined();
});
