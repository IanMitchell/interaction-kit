/**
 * @vitest-environment node
 */
import express from "express";

import verifyInteraction from "../src/middleware/express.js";

import { afterEach, beforeAll, expect, test, vi } from "vitest";
import { getKeyPair, getSignature } from "./helpers.js";

const app = express();
const { privateKey, publicKey } = await getKeyPair();

const spyEndpoint = vi.fn((req: express.Request, res: express.Response) => {
	res.status(200).json({ type: 1 });
});

beforeAll(() => {
	app.post("/", verifyInteraction(publicKey), spyEndpoint);
	app.listen(8080);
});

afterEach(() => {
	vi.clearAllMocks();
});

test("verifyInteraction returns a function", async () => {
	const middleware = verifyInteraction(publicKey);
	expect(middleware).toBeTypeOf("function");
});

test("verifyInteraction calls next on success", async () => {
	const body = JSON.stringify({ type: 1 });
	const { timestamp, signature } = await getSignature(privateKey, body);

	await fetch("http://localhost:8080/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-Signature-Timestamp": timestamp,
			"X-Signature-Ed25519": signature,
		},
		body,
	});
	expect(spyEndpoint).toHaveBeenCalled();
});

test("verifyInteraction returns 401 on error", async () => {
	const body = JSON.stringify({ type: 1 });
	const { timestamp, signature } = await getSignature(privateKey, body);

	const response = await fetch("http://localhost:8080/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-Signature-Timestamp": `${timestamp.slice(1)}`,
			"X-Signature-Ed25519": signature,
		},
		body,
	});
	expect(spyEndpoint).not.toHaveBeenCalled();
	expect(response.status).toEqual(401);
});
