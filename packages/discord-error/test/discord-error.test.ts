import { describe, expect, test } from "vitest";
import { DiscordError, isDiscordError } from "../src/errors/discord-error.js";
import arrayError from "./fixtures/array.json";
import objectError from "./fixtures/object.json";
import requestError from "./fixtures/request.json";

test("isDiscordError identifies Discord errors", () => {
	expect(isDiscordError(arrayError)).toBe(true);
	expect(isDiscordError({ error: "Internal Server Error" })).toBe(false);
});

describe("Error parsing", () => {
	test("parses array responses", () => {
		const error = new DiscordError(
			new Request("https://localhost:3000"),
			new Response(),
			arrayError.code,
			arrayError
		);

		expect(error.name).toBe("DiscordError[50035]");
		expect(error.code).toBe(arrayError.code);
		expect(error.request).toBeDefined();
		expect(error.response).toBeDefined();
		expect(error.raw).toBe(arrayError);

		expect(error.message).toMatchInlineSnapshot(`
			"Invalid Form Body
			activities[0].platform[BASE_TYPE_CHOICES]: Value must be one of ('desktop', 'android', 'ios').
			activities[0].type[BASE_TYPE_CHOICES]: Value must be one of (0, 1, 2, 3, 4, 5)."
		`);
	});

	test("parses object responses", () => {
		const error = new DiscordError(
			new Request("https://localhost:3000"),
			new Response(),
			objectError.code,
			objectError
		);

		expect(error.name).toBe("DiscordError[50035]");
		expect(error.code).toBe(objectError.code);
		expect(error.request).toBeDefined();
		expect(error.response).toBeDefined();
		expect(error.raw).toBe(objectError);

		expect(error.message).toMatchInlineSnapshot(`
			"Invalid Form Body
			access_token[BASE_TYPE_REQUIRED]: This field is required"
		`);
	});

	test("parses request errors", () => {
		const error = new DiscordError(
			new Request("https://localhost:3000"),
			new Response(),
			requestError.code,
			requestError
		);

		expect(error.name).toBe("DiscordError[50035]");
		expect(error.code).toBe(requestError.code);
		expect(error.request).toBeDefined();
		expect(error.response).toBeDefined();
		expect(error.raw).toBe(requestError);

		expect(error.message).toMatchInlineSnapshot(`
			"Invalid Form Body
			0[APPLICATION_COMMAND_TOO_LARGE]: Command exceeds maximum size (4000)"
		`);
	});
});
