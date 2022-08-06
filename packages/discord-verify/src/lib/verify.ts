import type {
	Request,
	SubtleCrypto,
	SubtleCryptoImportKeyAlgorithm,
} from "../types";

export declare class TextEncoder {
	constructor();
	encode(input?: string): Uint8Array;
}

const encoder = new TextEncoder();

/**
 * Helper method that takes in a hex string and converts it to its binary representation.
 * @param hex Hex string to convert to binary
 * @returns The binary form of a hex string
 */
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

/**
 * Helper values for popular platforms
 */
export const PlatformAlgorithm = {
	Cloudflare: {
		name: "NODE-ED25519",
		namedCurve: "NODE-ED25519",
		public: true,
	},
	Vercel: {
		name: "eddsa",
		namedCurve: "ed25519",
	},
};

/**
 * Validates a request from Discord
 * @param request Request to verify
 * @param publicKey The application's public key
 * @param subtleCrypto The crypto engine to use
 * @param algorithm The name of the crypto algorithm to use
 * @returns Whether the request is valid or not
 */
export async function isValidRequest(
	request: Request,
	publicKey: string,
	subtleCrypto: SubtleCrypto,
	algorithm: SubtleCryptoImportKeyAlgorithm | string = "Ed25519"
) {
	const clone = request.clone();
	const timestamp = clone.headers.get("X-Signature-Timestamp");
	const signature = clone.headers.get("X-Signature-Ed25519");
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

/**
 * Determines if a request is valid or not based on provided values
 * @param rawBody The raw body of the request
 * @param signature The signature header of the request
 * @param timestamp The timestamp header of the request
 * @param publicKey The application's public key
 * @param subtleCrypto The crypto engine to use
 * @param algorithm The name of the crypto algorithm to use
 * @returns Whether the request is valid or not
 */
export async function validate(
	rawBody: string | null | undefined,
	signature: string | null | undefined,
	timestamp: string | null | undefined,
	publicKey: string,
	subtleCrypto: SubtleCrypto,
	algorithm: SubtleCryptoImportKeyAlgorithm | string = "Ed25519"
) {
	if (timestamp == null || signature == null || rawBody == null) {
		return false;
	}

	const key = await getCryptoKey(publicKey, subtleCrypto, algorithm);
	const name = typeof algorithm === "string" ? algorithm : algorithm.name;

	const isVerified = await subtleCrypto.verify(
		name,
		key,
		hexToBinary(signature),
		encoder.encode(`${timestamp ?? ""}${rawBody}`)
	);

	return isVerified;
}
