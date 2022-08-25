import { describe, expect, test, vi } from "vitest";
import {
	hexStringToBinary,
	isValidRequest,
	PlatformAlgorithm,
	verify,
} from "../src/web.js";
import { encode, getKeyPair, getMockRequest, getSignature } from "./helpers.js";

test("Clones the request", async () => {
	const { privateKey, publicKey } = await getKeyPair();

	const request = await getMockRequest(privateKey, { hello: "world" });
	const verified = await isValidRequest(
		request,
		publicKey,
		PlatformAlgorithm.VercelDev
	);

	expect(async () => {
		const body = await request.text();
	}).not.toThrow();
});

test("Handles valid requests", async () => {
	const { privateKey, publicKey } = await getKeyPair();
	const request = await getMockRequest(privateKey, { hello: "world" });

	const valid = await isValidRequest(
		request,
		publicKey,
		PlatformAlgorithm.VercelDev
	);
	expect(valid).toBe(true);
});

test("Custom validator verifies requests", async () => {
	const { privateKey, publicKey } = await getKeyPair();
	const request = await getMockRequest(privateKey, { hello: "world" });
	const body = await request.text();
	const signature = request.headers.get("X-Signature-Ed25519");
	const timestamp = request.headers.get("X-Signature-Timestamp");

	const isValid = await verify(
		body,
		signature,
		timestamp,
		publicKey,
		crypto.subtle,
		PlatformAlgorithm.VercelDev
	);
	expect(isValid).toBe(true);
});

describe("Invalid Requests", () => {
	test("Rejects requests with a missing timestamp", async () => {
		const { privateKey, publicKey } = await getKeyPair();
		const request = await getMockRequest(privateKey, { hello: "world" });
		request.headers.delete("X-Signature-Timestamp");

		const valid = await isValidRequest(
			request,
			publicKey,
			PlatformAlgorithm.VercelDev
		);
		expect(valid).toBe(false);
	});

	test("Reject unverified requests", async () => {
		const { privateKey, publicKey } = await getKeyPair();
		const request = await getMockRequest(privateKey, { hello: "world" });
		request.headers.set("X-Signature-Timestamp", Date.now().toString());

		const valid = await isValidRequest(
			request,
			publicKey,
			PlatformAlgorithm.VercelDev
		);
		expect(valid).toBe(false);
	});

	test("Rejects invalid keys", async () => {
		const { privateKey, publicKey } = await getKeyPair();
		const { privateKey: newPrivateKey } = await getKeyPair();
		const { signature } = await getSignature(
			newPrivateKey,
			JSON.stringify({ hello: "world" }, null, 0)
		);

		const request = await getMockRequest(privateKey, { hello: "world" });
		request.headers.set("X-Signature-Ed25519", signature);

		const valid = await isValidRequest(
			request,
			publicKey,
			PlatformAlgorithm.VercelDev
		);
		expect(valid).toBe(false);
	});
});

describe("Supports different environments", () => {
	test("Supports Vercel", async () => {
		const importSpy = vi.spyOn(crypto.subtle, "importKey");
		importSpy.mockImplementationOnce(async () =>
			Promise.resolve({} as CryptoKey)
		);
		const verifySpy = vi.spyOn(crypto.subtle, "verify");
		verifySpy.mockImplementationOnce(async () => Promise.resolve(true));

		const { privateKey, publicKey } = await getKeyPair();
		const request = await getMockRequest(privateKey, { hello: "world" });

		await isValidRequest(request, publicKey, PlatformAlgorithm.VercelDev);
		expect(importSpy).toHaveBeenCalledWith(
			"raw",
			hexStringToBinary(publicKey),
			PlatformAlgorithm.VercelDev,
			true,
			["verify"]
		);

		const encodedValue = await encode(request);
		expect(verifySpy).toHaveBeenCalledWith(
			PlatformAlgorithm.VercelDev.name,
			{},
			hexStringToBinary(request.headers.get("X-Signature-Ed25519")),
			encodedValue
		);
	});

	test("Supports Cloudflare", async () => {
		const importSpy = vi.spyOn(crypto.subtle, "importKey");
		importSpy.mockImplementationOnce(async () =>
			Promise.resolve({} as CryptoKey)
		);
		const verifySpy = vi.spyOn(crypto.subtle, "verify");
		verifySpy.mockImplementationOnce(async () => Promise.resolve(true));

		const { privateKey, publicKey } = await getKeyPair();
		const request = await getMockRequest(privateKey, { hello: "world" });

		await isValidRequest(request, publicKey, PlatformAlgorithm.Cloudflare);
		expect(importSpy).toHaveBeenCalledWith(
			"raw",
			hexStringToBinary(publicKey),
			PlatformAlgorithm.Cloudflare,
			true,
			["verify"]
		);

		const encodedValue = await encode(request);
		expect(verifySpy).toHaveBeenCalledWith(
			PlatformAlgorithm.Cloudflare.name,
			{},
			hexStringToBinary(request.headers.get("X-Signature-Ed25519")),
			encodedValue
		);
	});
});
