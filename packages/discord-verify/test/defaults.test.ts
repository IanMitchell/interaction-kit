/**
 * @vitest-environment node
 */
import { expect, test, vi } from "vitest";
import { hexToBinary, isValidRequest } from "../src/verify";

test("Uses Ed25519 by default", async () => {
	const importSpy = vi.spyOn(crypto.subtle, "importKey");
	importSpy.mockImplementationOnce(async () =>
		Promise.resolve({} as CryptoKey)
	);
	const verifySpy = vi.spyOn(crypto.subtle, "verify");
	verifySpy.mockImplementationOnce(async () => Promise.resolve(true));
	const key = "default";

	await isValidRequest(new Request("https://localhost:3000"), key);
	expect(importSpy).toHaveBeenCalledWith(
		"raw",
		hexToBinary(key),
		"Ed25519",
		true,
		["verify"]
	);
	expect(verifySpy).toHaveBeenCalledWith(
		"Ed25519",
		{},
		new Uint8Array([]),
		new Uint8Array([])
	);
});
