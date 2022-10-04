import { DiscordError } from "discord-error";
import { Routes } from "discord.js";
import { describe, expect, test, vi } from "vitest";
import { Manager } from "../src/manager";
import { RequestMethod } from "../src/types";

describe("Rate Limits", () => {
	test.todo("Throttles Global Rate Limited requests");

	test.todo("Throttles Local Rate Limited requests");

	test.todo("Handles Rate Limit Chains");

	test.todo("Handles Retry Headers");

	test.todo("Handles Global Rate Limits");
});

describe("Queue Chaining", () => {
	test.todo("Can add to Queue");

	test.todo("Queue Processes Requests");

	test.todo("Returns value of Queue Request");
});

describe("Requests", () => {
	test.todo("Tracks Global Request Counter");

	test.todo("Handles Abort Signal");

	test.todo("Fetches Data with correct HTTP Method");

	test.todo("Handles changed bucket hashes");

	test.todo("Returns JSON Response");
});

describe("Error Handling", () => {
	test.todo("Retries Timeouts");

	test("Request errors do not break Queue", async () => {
		// mock global fetch to throw an unauthorized error on the first request
		let requestCounts = 0;
		vi.stubGlobal(
			"fetch",
			vi.fn(() => {
				// throw the first request
				if (requestCounts++ === 0) {
					return new Response(
						JSON.stringify({ message: "401: Unauthorized", code: 0 }),
						{
							status: 401,
							statusText: "Unauthorized",
							headers: {
								"Content-Type": "application/json",
							},
						}
					);
				}
				return new Response(
					JSON.stringify({ url: "wss://gateway.discord.gg" }),
					{
						status: 200,
						statusText: "OK",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);
			})
		);

		const manager = new Manager({});

		manager.setToken("token");
		try {
			await manager.queue({
				method: RequestMethod.Get,
				path: Routes.channel("839006448057974826"),
			});
		} catch (error) {
			expect(error).toBeInstanceOf(DiscordError);
		}

		expect(
			await manager.queue({
				method: RequestMethod.Get,
				path: Routes.gateway(),
				auth: false,
			})
		).toHaveProperty("url");
	});

	test.todo("Handles Server Errors");

	test.todo("Handles Validation Errors");

	test.todo("Handles Auth Errors");
});

describe("Callbacks", () => {
	test.todo("Executes onRequest");

	test.todo("Executs onRateLimit");
});
