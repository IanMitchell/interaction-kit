import { test } from "vitest";
import Client from "../src/client.js";
import { setMockResponse } from "./util/mock-fetch.js";

test.todo("Retries Timeouts");

test("Request errors do not break Queue", async () => {
	const client = new Client({ retries: 0 }).setToken("test");

	setMockResponse({ status: 500, body: { success: false } })
		.intercept({ path: "/api/v10/" })
		.reply(200, { success: true });

	const failureResponse = await client.get("/");
	const successResponse = await client.get("/");

	const failureData = await failureResponse.json();
	const successData = await successResponse.json();

	expect(failureData.success).toBe(false);
	expect(successData.success).toBe(true);
});

test.todo("Handles Server Errors");

test.todo("Handles Validation Errors");

test.todo("Handles Auth Errors");
