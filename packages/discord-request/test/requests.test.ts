import { describe, expect, test, vi } from "vitest";
import Client from "../src/client.js";
import { setMockResponse } from "./util/mock-fetch.js";

describe("Attachment Requests", () => {
	test.todo("Handles Basic Attachments");

	test.todo("Handles Attachments with Metadata");

	test.todo("Handles Attachments with extra FormData");
});

describe("Content Types", () => {
	test.todo("Handles Raw Request Bodies");

	test.todo("Handles JSON Request Bodies");
});

describe("Chaining", () => {
	test.todo("Can chain requests");

	test.todo("Queues automatically run");

	test.todo("Tracks Global Request Counter");
});

test("Fetches Data with correct HTTP Method", async () => {
	const onRequest = vi.fn();
	const client = new Client({ onRequest }).setToken("test");

	setMockResponse({ status: 200, body: { success: true } });
	await client.get("/");

	setMockResponse({ status: 200, body: { success: true }, method: "POST" });
	await client.post("/");

	setMockResponse({ status: 200, body: { success: true }, method: "PUT" });
	await client.put("/");

	setMockResponse({ status: 200, body: { success: true }, method: "PATCH" });
	await client.patch("/");

	setMockResponse({ status: 200, body: { success: true }, method: "DELETE" });
	await client.delete("/");

	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	const methods = onRequest.mock.calls.map(([, , options]) => options.method);
	expect(methods).toEqual(["GET", "POST", "PUT", "PATCH", "DELETE"]);
});

test("Returns JSON Response", async () => {
	const client = new Client().setToken("test");
	const body = { success: true, json: { key: "value " } };

	setMockResponse({
		status: 200,
		body,
		headers: { "Content-Type": "application/json" },
	});
	const response = await client.get("/");

	expect(response).toEqual(body);
});
