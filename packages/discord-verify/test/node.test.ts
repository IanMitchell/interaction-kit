/**
 * @vitest-environment node
 */
import crypto from "node:crypto";
import { expect, test, vi } from "vitest";
import { hexStringToBinary, isValidRequest } from "../src/node.js";
import { encode, getKeyPair, getMockRequest } from "./helpers.js";

test("Uses Ed25519 by default", async () => {
	// @ts-expect-error Crypto types are not defined yet
	const importSpy = vi.spyOn(crypto.subtle, "importKey");
	importSpy.mockImplementationOnce(async () =>
		Promise.resolve({} as CryptoKey)
	);

	// @ts-expect-error Crypto types are not defined yet
	const verifySpy = vi.spyOn(crypto.subtle, "verify");
	verifySpy.mockImplementationOnce(async () => Promise.resolve(true));

	const { privateKey, publicKey } = await getKeyPair();
	const request = await getMockRequest(privateKey, { hello: "world" });

	await isValidRequest(request, publicKey);
	expect(importSpy).toHaveBeenCalledWith(
		"raw",
		hexStringToBinary(publicKey),
		"Ed25519",
		true,
		["verify"]
	);

	const encodedValue = await encode(request);
	expect(verifySpy).toHaveBeenCalledWith(
		"Ed25519",
		{},
		hexStringToBinary(request.headers.get("X-Signature-Ed25519")),
		encodedValue
	);
});
