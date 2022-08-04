import * as ed from "@noble/ed25519";

async function* keyGenerator() {
	while (true) {
		const privateKey = ed.utils.randomPrivateKey();
		const publicKey = await ed.getPublicKey(privateKey);
		yield {
			privateKey,
			publicKey: publicKey.toString(),
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
	const date = Date.now();
	const signature = await ed.sign(
		Uint8Array.from(
			`${date}${body}`.split("").map((char) => char.charCodeAt(0))
		),
		privateKey
	);
	return { date, signature: signature.toString() };
}

export async function getMockRequest(
	privateKey: Uint8Array,
	json: Record<string, unknown>,
	headers: Record<string, string> = {}
) {
	const body = JSON.stringify(json, null, 0);
	const { date, signature } = await getSignature(privateKey, body);

	return new Request("http://localhost:3000", {
		method: "POST",
		body,
		headers: {
			"Content-Type": "application/json",
			"X-Signature-Ed25519": signature,
			"X-Signature-Timestamp": date.toString(),
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
