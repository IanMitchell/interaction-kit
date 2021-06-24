import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
enableFetchMocks();

import { URL } from "url";
import Bucket from "../src/bucket";
import client from "../src/client";

const emptyFunction = () => {};

beforeEach(() => {
	fetchMock.resetMocks();
});

describe("rate limits", () => {
	test.todo("should throttle global rate limits");

	test.todo("should respond to immediate 429 global limits");

	test.todo("should clear global timeouts based on headers");

	test.todo("should limit all buckets for global rate limit");

	test.todo("should throttle bucket rate limits");

	test.todo("should respond to immediate 429 local limits");

	test.todo("should clear local timeout based on headers");

	test.todo("should only limit local bucket for rate limit");
});

describe("buckets", () => {
	test("should alert to unknown HTTP status", async () => {
		fetchMock.mockResponseOnce(JSON.stringify({ test: true }), {
			status: 599,
		});

		const spy = jest.spyOn(console, "warn").mockImplementation();

		const bucket = new Bucket(emptyFunction, emptyFunction);
		await bucket.request(new URL("http://localhost:3000"), { method: "GET" });

		expect(spy).toHaveBeenCalled();
	});

	test.todo("should alert to incorrect bucket assignment");
});

describe("client", () => {
	test.todo("should require bucket information");

	test("should return a singleton", async () => {
		const dup = await import("../src/client");
		expect(dup.default).toBe(client);
	});

	test.todo("should expose HTTP methods");

	test.todo("should lazily initialize buckets");

	test.todo("should accept fetch parameters in HTTP methods");
});
