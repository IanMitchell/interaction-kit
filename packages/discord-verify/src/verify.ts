const encoder = new TextEncoder();

const KEYS: Record<string, CryptoKey> = {};

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
	if (KEYS[publicKey] != null) {
		return KEYS[publicKey];
	}

	const key = await subtleCrypto.importKey(
		"raw",
		hexToBinary(publicKey),
		algorithm,
		true,
		["verify"]
	);

	KEYS[publicKey] = key;
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
	const key = await getCryptoKey(publicKey, subtleCrypto, algorithm);
	const signature = hexToBinary(clone.headers.get("X-Signature-Ed25519"));
	const timestamp = clone.headers.get("X-Signature-Timestamp");
	const body = await clone.text();
	const name = typeof algorithm === "string" ? algorithm : algorithm.name;

	const isVerified = await subtleCrypto.verify(
		name,
		key,
		signature,
		encoder.encode(`${timestamp ?? ""}${body}`)
	);

	if (signature == null || timestamp == null || body == null || !isVerified) {
		return false;
	}

	return true;
}
