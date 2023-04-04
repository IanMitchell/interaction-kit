import { expect, test } from "vitest";
import { Client } from "../src/client.js";
import { intercept } from "./util/mock-fetch.js";

test("Abort signals interrupt in-flight requests", async () => {
	const controller = new AbortController();
	const client = new Client({
		abortSignal: controller.signal,
	});

	const body = { success: true, json: { key: "value " } };
	intercept("/abort")
		.reply(200, body, {
			headers: { "Content-Type": "application/json" },
		})
		.delay(5000);

	await expect(async () => {
		const promise = client.get("/abort");
		controller.abort();
		await promise;
	}).rejects.toThrow("The operation was aborted.");
});
