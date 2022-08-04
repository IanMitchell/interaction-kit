const encoder = new TextEncoder();

export function hexToBinary(hex: string | null) {
	if (hex == null) {
		return new Uint8Array(0);
	}

	const buffer = new Uint8Array(Math.ceil(hex.length / 2));
	for (let i = 0; i < buffer.length; i++) {
		buffer[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
	}

	return buffer;
}

async function getCryptoKey(
	publicKey: string,
	subtleCrypto: SubtleCrypto,
	algorithm: SubtleCryptoImportKeyAlgorithm | string
) {
	const key = await subtleCrypto.importKey(
		"raw",
		hexToBinary(publicKey),
		algorithm,
		true,
		["verify"]
	);

	return key;
}

export const PlatformAlgorithm = {
	Cloudflare: {
		name: "NODE-ED25519",
		namedCurve: "NODE-ED25519",
	},
	Vercel: {
		name: "eddsa",
		namedCurve: "ed25519",
	},
};

export async function isValidRequest(
	request: Request,
	publicKey: string,
	subtleCrypto: SubtleCrypto,
	algorithm: SubtleCryptoImportKeyAlgorithm | string = "Ed25519"
) {
	const clone = request.clone();
	const timestamp = clone.headers.get("X-Signature-Timestamp");

	if (timestamp == null) {
		return false;
	}

	const signature = hexToBinary(clone.headers.get("X-Signature-Ed25519"));
	const body = await clone.text();

	return validate(
		body,
		signature,
		timestamp,
		publicKey,
		subtleCrypto,
		algorithm
	);
}

export async function validate(
	rawBody: string,
	signature: Uint8Array,
	timestamp: string,
	publicKey: string,
	subtleCrypto: SubtleCrypto,
	algorithm: SubtleCryptoImportKeyAlgorithm | string = "Ed25519"
) {
	const key = await getCryptoKey(publicKey, subtleCrypto, algorithm);
	const name = typeof algorithm === "string" ? algorithm : algorithm.name;

	const isVerified = await subtleCrypto.verify(
		name,
		key,
		signature,
		encoder.encode(`${timestamp ?? ""}${rawBody}`)
	);

	return isVerified;
}
