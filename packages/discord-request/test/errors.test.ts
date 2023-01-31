import { DiscordError } from "discord-error";
import { expect, test } from "vitest";
import Client from "../src/client.js";
import { getMockClient, setMockResponse } from "./util/mock-fetch.js";

test("Retries Timeouts", async () => {
	const client = new Client({ retries: 3, timeout: 1000 }).setToken("test");

	const mock = getMockClient();

	mock
		.intercept({ path: "/api/v10/" })
		.reply(
			200,
			{ success: false },
			{ headers: { "Content-Type": "application/json" } }
		)
		.delay(1000);

	mock
		.intercept({ path: "/api/v10/" })
		.reply(
			200,
			{ success: true },
			{ headers: { "Content-Type": "application/json" } }
		);

	const response = await client.get("/");
	expect(response.success).toBe(true);
});

test("Request errors do not break Queue", async () => {
	const client = new Client({ retries: 0 }).setToken("test");

	const mock = getMockClient();

	mock
		.intercept({ path: "/api/v10/" })
		.reply(
			500,
			{ success: false },
			{ headers: { "Content-Type": "application/json" } }
		)
		.delay(1000);

	mock
		.intercept({ path: "/api/v10/" })
		.reply(
			200,
			{ success: true },
			{ headers: { "Content-Type": "application/json" } }
		);

	const [failure, success] = await Promise.all([
		client.get("/").catch((error) => ({ success: false })),
		client.get("/"),
	]);

	expect(failure.success).toBe(false);
	expect(success.success).toBe(true);
});

test("Handles Server Errors", async () => {
	const client = new Client({ retries: 0 }).setToken("test");
	setMockResponse({ status: 500, body: { success: false } });

	await expect(async () => {
		await client.get("/");
	}).rejects.toThrow();
});

test("Handles Validation Errors", async () => {
	const client = new Client({ retries: 0 }).setToken("test");
	setMockResponse({ status: 400, body: { success: false } });

	await expect(async () => {
		await client.get("/");
	}).rejects.toThrow(DiscordError);
});
