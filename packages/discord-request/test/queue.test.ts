import { describe, test } from "vitest";

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

	test.todo("Request errors do not break Queue");

	test.todo("Handles Server Errors");

	test.todo("Handles Validation Errors");

	test.todo("Handles Auth Errors");
});

describe("Callbacks", () => {
	test.todo("Executes onRequest");

	test.todo("Executs onRateLimit");
});
