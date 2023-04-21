import { DiscordError } from "discord-error";
import { expect, test } from "vitest";
import { Client } from "../src/client.js";
import { RateLimitError } from "../src/errors/rate-limit-error.js";
import { RequestError } from "../src/errors/request-error.js";
import { intercept } from "./util/mock-fetch.js";

test("Handles Server Errors", async () => {
	const client = new Client();
	client.setToken("test");

	intercept("/server-error").reply(
		500,
		{ success: false },
		{ headers: { "Content-Type": "application/json" } }
	);

	await expect(async () => {
		await client.get("/server-error");
	}).rejects.toThrow();
});

test("Handles Validation Errors", async () => {
	const client = new Client();
	client.setToken("test");

	intercept("/validation-error").reply(
		400,
		{ success: false },
		{ headers: { "Content-Type": "application/json" } }
	);

	await expect(async () => {
		await client.get("/validation-error");
	}).rejects.toThrow(DiscordError);
});

test("Handles Rate Limit Errors", async () => {
	const client = new Client();
	client.setToken("test");

	intercept("/rate-limit-error").reply(
		429,
		{ success: false },
		{ headers: { "Content-Type": "application/json", "retry-after": "429" } }
	);

	await expect(async () => {
		await client.get("/rate-limit-error");
	}).rejects.toThrow(RateLimitError);
});

test("Handles HTML Rate Limit Errors", async () => {
	const client = new Client();
	client.setToken("test");

	intercept("/rate-limit-html-error").reply(
		404,
		"<html><body><p>Bad</p></body></html>",
		{ headers: { "Content-Type": "text/html" } }
	);

	await expect(async () => {
		await client.get("/rate-limit-html-error");
	}).rejects.toThrow(RequestError);
});
