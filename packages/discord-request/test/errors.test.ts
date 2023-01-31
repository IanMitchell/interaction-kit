import { DiscordError } from "discord-error";
import { expect, test } from "vitest";
import Client from "../src/client.js";
import { intercept } from "./util/mock-fetch.js";

test("Retries Timeouts", async () => {
	const client = new Client({ retries: 3, timeout: 1000 }).setToken("test");

	intercept("/retry-timeout")
		.reply(
			200,
			{ success: false },
			{ headers: { "Content-Type": "application/json" } }
		)
		.delay(1000);

	intercept("/retry-timeout").reply(
		200,
		{ success: true },
		{ headers: { "Content-Type": "application/json" } }
	);

	const response = await client.get("/retry-timeout");
	expect(response.success).toBe(true);
});

test("Request errors do not break Queue", async () => {
	const client = new Client({ retries: 0 }).setToken("test");

	intercept("/request-error-queue")
		.reply(
			500,
			{ success: false },
			{ headers: { "Content-Type": "application/json" } }
		)
		.delay(1000);

	intercept("/request-error-queue").reply(
		200,
		{ success: true },
		{ headers: { "Content-Type": "application/json" } }
	);

	const [failure, success] = await Promise.all([
		client.get("/request-error-queue").catch((error) => ({ success: false })),
		client.get("/request-error-queue"),
	]);

	expect(failure.success).toBe(false);
	expect(success.success).toBe(true);
});

test("Handles Server Errors", async () => {
	const client = new Client({ retries: 0 }).setToken("test");

	intercept("/server-error").reply(
		500,
		{ success: false },
		{ headers: { "Content-Type": "application/json" } }
	);

	await expect(async () => {
		await client.get("/server-error");
	}).rejects.toThrow();
});

test("Handles Validation Errors", async () => {
	const client = new Client({ retries: 0 }).setToken("test");

	intercept("/validation-error").reply(
		400,
		{ success: false },
		{ headers: { "Content-Type": "application/json" } }
	);

	await expect(async () => {
		await client.get("/validation-error");
	}).rejects.toThrow(DiscordError);
});
