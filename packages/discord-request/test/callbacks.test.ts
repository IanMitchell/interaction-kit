import { expect, test, vi } from "vitest";
import { Client } from "../src/client.js";
import { intercept } from "./util/mock-fetch.js";

test("Executes onRequest", async () => {
	const onRequest = vi.fn();

	const client = new Client({
		onRequest,
	});
	client.setToken("test");

	intercept("/onRequest").reply(
		200,
		{ success: true },
		{ headers: { "Content-Type": "application/json" } }
	);

	await client.get("/onRequest");

	expect(onRequest).toHaveBeenCalledWith(
		"https://discord.com/api/v10/onRequest",
		expect.objectContaining({
			body: null,
			method: "GET",
		}),
		0
	);
});
