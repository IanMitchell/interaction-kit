import { describe, expect, test, vi } from "vitest";
import { Client } from "../src/client.js";
import { intercept } from "./util/mock-fetch.js";

describe("Attachment Requests", () => {
	test("Handles Basic Attachments", async () => {
		const client = new Client();
		client.setToken("test");

		intercept("/basic-attachment", { method: "POST" }).reply(
			200,
			(request) => {
				const body = request.body as FormData;
				const { name } = body.get("files[0]") as File;

				return { name };
			},
			{
				headers: { "Content-Type": "application/json" },
			}
		);

		const response = (await client.post("/basic-attachment", {
			files: [
				{
					name: "test.txt",
					data: new File(["I learned to code on notepad++"], "test.txt", {
						type: "text/plain",
					}),
				},
			],
			headers: { "Content-Type": "multipart/form-data" },
		})) as Record<string, unknown>;

		expect(response.name).toBe("test.txt");
	});

	test("Handles Attachments with Metadata", async () => {
		const client = new Client();
		client.setToken("test");

		intercept("/attachment-metadata", { method: "POST" }).reply(
			200,
			(request) => {
				const body = request.body as FormData;
				const input = body.getAll("files[10]");
				const { filename, description } = JSON.parse(input[1] as string) as {
					filename: string;
					description: string;
				};

				return {
					filename,
					description,
				};
			},
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

		const response = (await client.post("/attachment-metadata", {
			files: [
				{
					id: "10",
					name: "test.txt",
					data: new File(["I learned to code on notepad++"], "test.txt", {
						type: "text/plain",
					}),
				},
			],
			formData,
			headers: { "Content-Type": "multipart/form-data" },
		})) as Record<string, unknown>;

		expect(response.filename).toBe("secrets.txt");
		expect(response.description).toBe("This is a text file with many secrets");
	});
});

describe("Content Types", () => {
	/**
	 * FIXME: This test is failing because of an `edge-runtime` issue. See:
	 * https://github.com/vercel/edge-runtime/pull/80#issuecomment-1504349243
	 */
	// test("Handles Raw Request Bodies", async () => {
	// 	const client = new Client();
	// 	client.setToken("test");

	// 	intercept("/raw-request-body").reply(200, { success: true });

	// 	const response = await client.get("/raw-request-body");
	// 	expect(response).toBeInstanceOf(ArrayBuffer);
	// });

	test("Handles JSON Request Bodies", async () => {
		const client = new Client();
		client.setToken("test");

		intercept("/json-request-body").reply(
			200,
			{ success: true },
			{ headers: { "Content-Type": "application/json" } }
		);

		const response = (await client.get("/json-request-body")) as Record<
			string,
			unknown
		>;
		expect(response).toBeInstanceOf(Object);
		expect(response.success).toBe(true);
	});
});

test("Fetches Data with correct HTTP Method", async () => {
	const onRequest = vi.fn();
	const client = new Client({ onRequest });
	client.setToken("test");

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
	const methods = onRequest.mock.calls.map(([, options]) => options.method);
	expect(methods).toEqual(["GET", "POST", "PUT", "PATCH", "DELETE"]);
});

test("Returns JSON Response", async () => {
	const client = new Client();
	client.setToken("test");
	const body = { success: true, json: { key: "value " } };

	intercept("/json-request").reply(200, body, {
		headers: { "Content-Type": "application/json" },
	});
	const response = await client.get("/json-request");

	expect(response).toEqual(body);
});
