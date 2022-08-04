import { describe, expect, test, vi } from "vitest";
import { hexToBinary, isValidRequest, PlatformAlgorithm } from "../src/web";
import { encode, getKeyPair, getMockRequest, getSignature } from "./helpers";

test("Clones the request", async () => {
	const { privateKey, publicKey } = await getKeyPair();

	const request = await getMockRequest(privateKey, { hello: "world" });
	const verified = await isValidRequest(
		request,
		publicKey,
		PlatformAlgorithm.Vercel
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
		PlatformAlgorithm.Vercel
	);
	expect(valid).toBe(true);
});

describe("Invalid Requests", () => {
	test("Rejects requests with a missing signature", async () => {
		const { privateKey, publicKey } = await getKeyPair();
		const request = await getMockRequest(privateKey, { hello: "world" });
		request.headers.delete("X-Signature-Ed25519");

		const valid = await isValidRequest(
			request,
			publicKey,
			PlatformAlgorithm.Vercel
		);
		expect(valid).toBe(false);
	});

	test("Rejects requests with a missing timestamp", async () => {
		const { privateKey, publicKey } = await getKeyPair();
		const request = await getMockRequest(privateKey, { hello: "world" });
		request.headers.delete("X-Signature-Timestamp");

		const valid = await isValidRequest(
			request,
			publicKey,
			PlatformAlgorithm.Vercel
		);
		expect(valid).toBe(false);
	});

	test("Rejects requests with a missing body", async () => {
		const { privateKey, publicKey } = await getKeyPair();
		// @ts-expect-error Intentionally passing a null value to test an edge case
		const request = await getMockRequest(privateKey, null);

		const valid = await isValidRequest(
			request,
			publicKey,
			PlatformAlgorithm.Vercel
		);
		expect(valid).toBe(false);
	});

	test("Reject unverified requests", async () => {
		const { privateKey, publicKey } = await getKeyPair();
		const request = await getMockRequest(privateKey, { hello: "world" });
		request.headers.set(
			"X-Signature-Timestamp",
			(Date.now() + 1337).toString()
		);

		const valid = await isValidRequest(
			request,
			publicKey,
			PlatformAlgorithm.Vercel
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
			PlatformAlgorithm.Vercel
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

		await isValidRequest(request, publicKey, PlatformAlgorithm.Vercel);
		expect(importSpy).toHaveBeenCalledWith(
			"raw",
			hexToBinary(publicKey),
			PlatformAlgorithm.Vercel,
			true,
			["verify"]
		);

		const encodedValue = await encode(request);
		expect(verifySpy).toHaveBeenCalledWith(
			PlatformAlgorithm.Vercel.name,
			{},
			hexToBinary(request.headers.get("X-Signature-Ed25519")),
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
			hexToBinary(publicKey),
			PlatformAlgorithm.Cloudflare,
			true,
			["verify"]
		);

		const encodedValue = await encode(request);
		expect(verifySpy).toHaveBeenCalledWith(
			PlatformAlgorithm.Cloudflare.name,
			{},
			hexToBinary(request.headers.get("X-Signature-Ed25519")),
			encodedValue
		);
	});
});
