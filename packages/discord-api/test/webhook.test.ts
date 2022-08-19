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
		expect(spy).toHaveBeenCalledWith(
			expect.anything,
			{
				body: expect.anything,
				headers: { "X-Audit-Log-Reason": "Vitest Log" },
			},
			expect.anything
		);
	});

	test.todo("Includes webhook information");
});
