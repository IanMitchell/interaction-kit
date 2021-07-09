import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
enableFetchMocks();

import { URL } from "url";
import Bucket from "../src/bucket";
import client from "../src/client";

// eslint-disable-next-line @typescript-eslint/no-empty-function
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
		expect(spy.mock.calls[0][0]).toMatch(/returned a status code/);
	});

	test("should alert to incorrect bucket assignment", async () => {
		const spy = jest.spyOn(console, "warn").mockImplementation();
		const bucket = new Bucket(emptyFunction, emptyFunction);

		fetchMock.mockResponseOnce(JSON.stringify({ test: true }), {
			status: 200,
			headers: {
				"x-ratelimit-bucket": "1",
			},
		});
		await bucket.request(new URL("http://localhost:3000"), { method: "GET" });

		fetchMock.mockResponseOnce(JSON.stringify({ test: true }), {
			status: 200,
			headers: {
				"x-ratelimit-bucket": "2",
			},
		});
		await bucket.request(new URL("http://localhost:3000"), { method: "GET" });

		expect(spy).toHaveBeenCalled();
		expect(spy.mock.calls[0][0]).toMatch(/incorrect bucket assignment/);
	});

	test.todo("should queue and automatically execute requests");
});

describe("client", () => {
	test.todo("should require bucket information");
	// test("should require bucket information", async () => {
	// 	expect(() => {
	// 		// Suppress typescript since we're explicitly trying to break this case
	// 		// @ts-expect-error
	// 		const value = client.get(new URL("https://localhost:3000"), {}, {});
	// 	}).toThrow("You must define a bucket route and identifier");
	// });

	test("should return a singleton", async () => {
		const dup = await import("../src/client");
		expect(dup.default).toBe(client);
	});

	test.todo("should accept fetch parameters in HTTP methods");
});
