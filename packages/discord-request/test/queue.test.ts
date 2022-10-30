import { DiscordError } from "discord-error";
import { describe, expect, test, vi } from "vitest";
import { Manager } from "../src/manager.js";
import { RequestMethod } from "../src/types.js";

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

const mockFetchFailResponse = (status: number, statusText: string) => {
	return new Response(
		JSON.stringify({ message: `${status}: ${statusText}`, code: 0 }),
		{
			status,
			statusText,
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
};

const mockFetchSuccessResponse = (body: any) => {
	return new Response(JSON.stringify(body), {
		status: 200,
		statusText: "OK",
		headers: {
			"Content-Type": "application/json",
		},
	});
};

describe("Error Handling", () => {
	test.todo("Retries Timeouts");

	test("Request errors do not break Queue", async () => {
		// mock global fetch to throw an unauthorized error on the first request
		let requestCounts = 0;
		vi.stubGlobal(
			"fetch",
			vi.fn(() => {
				// throw the first request
				if (requestCounts++ === 0)
					return mockFetchFailResponse(401, "Unauthorized");

				return mockFetchSuccessResponse({ url: "wss://gateway.discord.gg" });
			})
		);

		const manager = new Manager({});

		manager.setToken("token");
		try {
			await manager.queue({
				method: RequestMethod.Get,
				path: "/channels/839006448057974826",
			});
		} catch (error) {
			expect(error).toBeInstanceOf(DiscordError);
		}

		expect(
			await manager.queue({
				method: RequestMethod.Get,
				path: "/gateway",
				auth: false,
			})
		).toHaveProperty("url");
	});

	test.todo("Handles Server Errors");

	test.todo("Handles Validation Errors");

	test("Handles Auth Errors", async () => {
		const manager = new Manager({});

		// mock fetch to always return an unauthorized error
		vi.stubGlobal(
			"fetch",
			vi.fn(() => mockFetchFailResponse(401, "Unauthorized"))
		);

		// expect an error to be thrown when no token is set and auth is true
		await expect(
			manager.queue({
				method: RequestMethod.Get,
				path: "/channels/839006448057974826",
			})
		).rejects.toThrow();

		manager.setToken("token");

		// expect an error to be thrown when the server returns a 401
		await expect(
			manager.queue({
				method: RequestMethod.Get,
				path: "/channels/839006448057974826",
			})
		).rejects.toThrow();

		// mock fetch to always return a 200
		vi.stubGlobal(
			"fetch",
			vi.fn(() => mockFetchSuccessResponse({ success: true }))
		);

		// expect token to have been reset after a request failed with a 401
		await expect(
			manager.queue({
				method: RequestMethod.Get,
				path: "/channels/839006448057974826",
			})
		).rejects.toThrow();

		// expect no error to be thrown when auth is false
		await expect(
			manager.queue({
				method: RequestMethod.Get,
				path: "/gateway",
				auth: false,
			})
		).resolves.not.toThrow();

		// expect no error to be thrown when auth is true and token is valid
		manager.setToken("token");
		await expect(
			manager.queue({
				method: RequestMethod.Get,
				path: "/channels/839006448057974826",
			})
		).resolves.not.toThrow();
	});
});

describe("Callbacks", () => {
	test.todo("Executes onRequest");

	test.todo("Executs onRateLimit");
});
