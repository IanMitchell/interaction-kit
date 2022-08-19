import { describe, expect, test, vi } from "vitest";
import { client } from "../src/client";
import { createWebhook } from "../src/routes/webhook";

describe("createWebhook", () => {
	test("Accepts an optional audit log entry", async () => {
		const spy = vi
			.spyOn(client, "post")
			.mockImplementation(async () => Promise.resolve(""));

		await createWebhook(
			"123",
			{ name: "Test Webhook", avatar: "avatar.png" },
			"Vitest Log"
		);
		expect(spy).toHaveBeenCalledWith(expect.anything(), {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			body: expect.anything(),
			headers: new Headers({ "X-Audit-Log-Reason": "Vitest Log" }),
		});
	});

	test("Includes webhook information", async () => {
		const spy = vi
			.spyOn(client, "post")
			.mockImplementation(async () => Promise.resolve(""));

		await createWebhook("123", { name: "Test Webhook", avatar: "avatar.png" });
		expect(spy).toHaveBeenCalledWith("/channels/123/webhooks", {
			body: {
				name: "Test Webhook",
				avatar: "avatar.png",
			},
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			headers: expect.any(Headers),
		});
	});
});
