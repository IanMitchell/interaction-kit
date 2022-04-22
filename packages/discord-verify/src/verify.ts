const encoder = new TextEncoder();

const KEYS: Record<string, CryptoKey> = {};

function hexToBinary(hex: string | null) {
	if (hex == null) {
		return new Uint8Array(0);
	}

	const buffer = new Uint8Array(Math.ceil(hex.length / 2));
	for (let i = 0; i < buffer.length; i++) {
		buffer[i] = parseInt(hex.substr(i * 2, 2), 16);
	}

	return buffer;
}

async function getCryptoKey(publicKey: string) {
	if (KEYS[publicKey] != null) {
		return KEYS[publicKey];
	}

	/* eslint-disable */
	// @ts-expect-error Unimplemented core TypeScript / Node types
	const key = (await webcrypto.subtle.importKey(
		"raw",
		hexToBinary(publicKey),
		{
			name: "NODE-ED25519",
			namedCurve: "NODE-ED25519",
			public: true,
		},
		true,
		["verify"]
	)) as CryptoKey;
	/* eslint-enable */

	KEYS[publicKey] = key;
	return key;
}

export default async function isValidRequest(
	request: Request,
	publicKey: string
) {
	const key = await getCryptoKey(publicKey);
	const signature = hexToBinary(request.headers.get("X-Signature-Ed25519"));
	const timestamp = request.headers.get("X-Signature-Timestamp");
	const body = await request.text();

	const isVerified = await crypto.subtle.verify(
		"NODE-ED25519",
		key,
		signature,
		encoder.encode(`${timestamp ?? ""}${body}`)
	);

	if (signature == null || timestamp == null || body == null || !isVerified) {
		return false;
	}

	return true;
}
