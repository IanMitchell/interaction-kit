import { describe, expect, test, vi } from "vitest";
import { hexToBinary, isValidRequest, PlatformAlgorithm } from "../src/verify";

function* keyGenerator() {
	let index = 1;
	while (true) {
		yield index.toString();
		index += 1;
	}
}

const publicKey = keyGenerator();

// function jsonBody(json: Record<string, unknown>) {
// 	const str = JSON.stringify(json, null, 0);
// 	const array = Array.from(str).reduce((array, character, index) => {
// 		array[index] = character.charCodeAt(0);
// 		return array;
// 	}, new Uint8Array(str.length));

// 	return new ReadableStream(array);
// }

// test("clones request", async () => {
// 	const request = new Request({
// 		body: jsonBody({ hello: "world " }),
// 		headers: new Headers({
// 			"Content-Type": "application/json",
// 		}),
// 	});

// 	const verified = await isValidRequest(request, "123");
// 	expect(async () => {
// 		const body = await request.json();
// 	}).not.toThrow();
// });

test.todo("Handles valid requests");

test.todo("Caches keys", async () => {
	const importSpy = vi.spyOn(crypto.subtle, "importKey");
	importSpy.mockImplementationOnce(async () =>
		Promise.resolve({} as CryptoKey)
	);

	await isValidRequest(new Request("https://localhost:3000"), "duplicate");
	await isValidRequest(new Request("https://localhost:3000"), "duplicate");

	expect(importSpy).toHaveBeenCalledOnce();
});

describe("Invalid Requests", () => {
	test.todo("Rejects requests with a missing signature");

	test.todo("Rejects requests with a missing timestamp");

	test.todo("Rejects requests with a missing body");

	test.todo("Reject unverified requests");
});

describe("Supports different environments", () => {
	test("Supports Vercel", async () => {
		const importSpy = vi.spyOn(crypto.subtle, "importKey");
		importSpy.mockImplementationOnce(async () =>
			Promise.resolve({} as CryptoKey)
		);
		const verifySpy = vi.spyOn(crypto.subtle, "verify");
		verifySpy.mockImplementationOnce(async () => Promise.resolve(true));
		const key = publicKey.next().value as string;

		await isValidRequest(new Request("https://localhost:3000"), key);
		expect(importSpy).toHaveBeenCalledWith(
			"raw",
			hexToBinary(key),
			PlatformAlgorithm.Vercel,
			true,
			["verify"]
		);
		expect(verifySpy).toHaveBeenCalledWith(
			PlatformAlgorithm.Vercel.name,
			{},
			new Uint8Array([]),
			new Uint8Array([])
		);
	});

	test("Supports Cloudflare", async () => {
		const importSpy = vi.spyOn(crypto.subtle, "importKey");
		importSpy.mockImplementationOnce(async () =>
			Promise.resolve({} as CryptoKey)
		);
		const verifySpy = vi.spyOn(crypto.subtle, "verify");
		verifySpy.mockImplementationOnce(async () => Promise.resolve(true));
		const key = publicKey.next().value as string;

		await isValidRequest(
			new Request("https://localhost:3000"),
			key,
			PlatformAlgorithm.Cloudflare
		);
		expect(importSpy).toHaveBeenCalledWith(
			"raw",
			hexToBinary(key),
			PlatformAlgorithm.Cloudflare,
			true,
			["verify"]
		);
		expect(verifySpy).toHaveBeenCalledWith(
			PlatformAlgorithm.Cloudflare.name,
			{},
			new Uint8Array([]),
			new Uint8Array([])
		);
	});
});
