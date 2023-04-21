import * as ed from "@noble/ed25519";
import { webcrypto } from "node:crypto";

// Compat fix: https://github.com/paulmillr/noble-ed25519/blob/main/index.js#L303-L308
if (!globalThis.crypto) {
	// @ts-expect-error package compatibility fix
	globalThis.crypto = webcrypto;
}

async function* keyGenerator() {
	while (true) {
		const privateKey = ed.utils.randomPrivateKey();
		const publicKey = await ed.getPublicKeyAsync(privateKey);
		yield {
			privateKey,
			publicKey: Buffer.from(publicKey).toString("hex"),
		};
	}
}

const keys = keyGenerator();

export async function getKeyPair() {
	const gen = await keys.next();

	if (gen.done) {
		throw new Error("Unable to generate keypair");
	}

	return gen.value;
}

export async function getSignature(privateKey: Uint8Array, body: string) {
	const timestamp = Math.round(Date.now() / 1000).toString();
	const value = Uint8Array.from(
		Buffer.concat([Buffer.from(timestamp), Buffer.from(body)])
	);

	const signature = await ed.signAsync(value, privateKey);
	return { timestamp, signature: Buffer.from(signature).toString("hex") };
}

export async function getMockRequest(
	privateKey: Uint8Array,
	json: Record<string, unknown>,
	headers: Record<string, string> = {}
) {
	const body = JSON.stringify(json);
	const { timestamp, signature } = await getSignature(privateKey, body);

	return new Request("http://localhost:3000", {
		method: "POST",
		body,
		headers: {
			"Content-Type": "application/json",
			"X-Signature-Ed25519": signature,
			"X-Signature-Timestamp": timestamp,
			...headers,
		},
	});
}

export async function encode(request: Request) {
	const encoder = new TextEncoder();
	const timestamp = request.headers.get("X-Signature-Timestamp") ?? "";
	const body = await request.text();
	return encoder.encode(`${timestamp}${body}`);
}
