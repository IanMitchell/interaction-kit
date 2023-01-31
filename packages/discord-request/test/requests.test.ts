import { describe, expect, test, vi } from "vitest";
import Client from "../src/client.js";
import { getMockClient, setMockResponse } from "./util/mock-fetch.js";

describe("Attachment Requests", () => {
	test("Handles Basic Attachments", async () => {
		const client = new Client({ retries: 0 }).setToken("test");
		const mock = getMockClient();

		mock
			.intercept({ path: "/api/v10/", method: "POST" })
			.reply(200, (request) => ({ name: request.body.get("files[0]").name }), {
				headers: { "Content-Type": "application/json" },
			});

		const response = await client.post("/", {
			files: [
				new File(["I learned to code on notepad++"], "test.txt", {
					type: "text/plain",
				}),
			],
			headers: { "Content-Type": "multipart/form-data" },
		});

		expect(response.name).toBe("test.txt");
	});

	test("Handles Attachments with Metadata", async () => {
		const client = new Client({ retries: 0 }).setToken("test");
		const mock = getMockClient();

		mock.intercept({ path: "/api/v10/", method: "POST" }).reply(
			200,
			(request) => ({
				name: JSON.parse(request.body.getAll("files[10]")[1]).filename,
				description: JSON.parse(request.body.getAll("files[10]")[1])
					.description,
			}),
			{
				headers: { "Content-Type": "application/json" },
			}
		);

		const formData = new FormData();
		formData.append(
			"files[10]",
			JSON.stringify({
				filename: "secrets.txt",
				description: "This is a text file with many secrets",
			})
		);

		const response = await client.post("/", {
			files: [
				{
					id: 10,
					data: new File(["I learned to code on notepad++"], "test.txt", {
						type: "text/plain",
					}),
				},
			],
			formData,
			headers: { "Content-Type": "multipart/form-data" },
		});

		expect(response.name).toBe("secrets.txt");
		expect(response.description).toBe("This is a text file with many secrets");
	});

	test.todo("Handles Attachments with extra FormData");
});

describe("Content Types", () => {
	test("Handles Raw Request Bodies", async () => {
		const client = new Client().setToken("test");
		const mock = getMockClient();

		mock.intercept({ path: "/api/v10/" }).reply(200, { success: true });

		const response = await client.get("/");
		expect(response).toBeInstanceOf(ArrayBuffer);
	});

	test("Handles JSON Request Bodies", async () => {
		const client = new Client().setToken("test");
		const mock = getMockClient();

		mock
			.intercept({ path: "/api/v10/" })
			.reply(
				200,
				{ success: true },
				{ headers: { "Content-Type": "application/json" } }
			);

		const response = await client.get("/");
		expect(response).toBeInstanceOf(Object);
		expect(response.success).toBe(true);
	});
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
