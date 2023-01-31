import { describe, expect, test, vi } from "vitest";
import Client from "../src/client.js";
import { intercept } from "./util/mock-fetch.js";

describe("Attachment Requests", () => {
	test("Handles Basic Attachments", async () => {
		const client = new Client({ retries: 0 }).setToken("test");

		intercept("/basic-attachment", { method: "POST" }).reply(
			200,
			(request) => ({ name: request.body.get("files[0]").name }),
			{
				headers: { "Content-Type": "application/json" },
			}
		);

		const response = await client.post("/basic-attachment", {
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

		intercept("/attachment-metadata", { method: "POST" }).reply(
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

		const response = await client.post("/attachment-metadata", {
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
});

describe("Content Types", () => {
	test("Handles Raw Request Bodies", async () => {
		const client = new Client().setToken("test");

		intercept("/raw-request-body").reply(200, { success: true });

		const response = await client.get("/raw-request-body");
		expect(response).toBeInstanceOf(ArrayBuffer);
	});

	test("Handles JSON Request Bodies", async () => {
		const client = new Client().setToken("test");

		intercept("/json-request-body").reply(
			200,
			{ success: true },
			{ headers: { "Content-Type": "application/json" } }
		);

		const response = await client.get("/json-request-body");
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

	intercept("/get").reply(
		200,
		{ success: true },
		{ headers: { "Content-Type": "application/json" } }
	);
	await client.get("/get");

	intercept("/post", { method: "POST" }).reply(
		200,
		{ success: true },
		{ headers: { "Content-Type": "application/json" } }
	);
	await client.post("/post");

	intercept("/put", { method: "PUT" }).reply(
		200,
		{ success: true },
		{ headers: { "Content-Type": "application/json" } }
	);
	await client.put("/put");

	intercept("/patch", { method: "PATCH" }).reply(
		200,
		{ success: true },
		{ headers: { "Content-Type": "application/json" } }
	);
	await client.patch("/patch");

	intercept("/delete", { method: "DELETE" }).reply(
		200,
		{ success: true },
		{ headers: { "Content-Type": "application/json" } }
	);
	await client.delete("/delete");

	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	const methods = onRequest.mock.calls.map(([, , options]) => options.method);
	expect(methods).toEqual(["GET", "POST", "PUT", "PATCH", "DELETE"]);
});

test("Returns JSON Response", async () => {
	const client = new Client().setToken("test");
	const body = { success: true, json: { key: "value " } };

	intercept("/json-request").reply(200, body, {
		headers: { "Content-Type": "application/json" },
	});
	const response = await client.get("/json-request");

	expect(response).toEqual(body);
});
