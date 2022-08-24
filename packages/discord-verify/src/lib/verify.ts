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

const KEYS = {
	ZERO: 48,
	A: 65,
	a: 97,
};

function hexCharToBinary(char: string) {
	const code = char.charCodeAt(0);

	if (code >= KEYS.a) {
		return code - KEYS.a + 10;
	}

	if (code >= KEYS.A) {
		return code - KEYS.A + 10;
	}

	return code - KEYS.ZERO;
}

/**
 * Helper method that takes in a hex string and converts it to its binary representation.
 * @param key Hex string to convert to binary
 * @returns The binary form of a hex string
 */
export function hexStringToBinary(key: string | null) {
	if (key == null) {
		return new Uint8Array(0).buffer;
	}

	const view = new Uint8Array(key.length / 2);

	for (let i = 0, o = 0; i < key.length; i += 2, ++o) {
		view[o] = (hexCharToBinary(key[i]) << 4) | hexCharToBinary(key[i + 1]);
	}

	return view.buffer;
}

async function getCryptoKey(
	publicKey: string,
	subtleCrypto: SubtleCrypto,
	algorithm: SubtleCryptoImportKeyAlgorithm | string
) {
	const key = await subtleCrypto.importKey(
		"raw",
		hexStringToBinary(publicKey),
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
	Web: "Ed25519",
	/**
	 * Node v18.4.0+
	 * Node v16.17.0+
	 * For Node v17, use OldNode
	 */
	NewNode: "Ed25519",
	/**
	 * Node v18.3.0 and below
	 * Node v17.0.0+
	 * Node v16.16.0 and below
	 */
	OldNode: {
		name: "NODE-ED25519",
		namedCurve: "NODE-ED25519",
		public: true,
	},
	Cloudflare: {
		name: "NODE-ED25519",
		namedCurve: "NODE-ED25519",
		public: true,
	},
	/**
	 * Despite being documented as 	{ name: "eddsa", namedCurve: "ed25519"} or
	 * { name: "ecdsa", namedCurve: "ed25519" }, Vercel uses the same format as
	 * Cloudflare in Production (despite Dev using documented formats)
	 */
	VercelProd: {
		name: "NODE-ED25519",
		namedCurve: "NODE-ED25519",
		public: true,
	},
	/**
	 * Despite being documented as using this format, Vercel uses the same format
	 * as Cloudflare in Production and only uses this format in Development.
	 */
	VercelDev: { name: "eddsa", namedCurve: "ed25519" },
};

/**
 * Validates a request from Discord. The request should not be consumed prior
 * to calling this function.
 * @param request Request to verify. This should have been consumed yet.
 * @param publicKey The application's public key
 * @param subtleCrypto The crypto engine to use
 * @param algorithm The name of the crypto algorithm to use
 * @returns Whether the request is valid or not
 */
export async function isValidRequest(
	request: Request,
	publicKey: string,
	subtleCrypto: SubtleCrypto,
	algorithm: SubtleCryptoImportKeyAlgorithm | string = PlatformAlgorithm.NewNode
) {
	const clone = request.clone();
	const timestamp = clone.headers.get("X-Signature-Timestamp");
	const signature = clone.headers.get("X-Signature-Ed25519");
	const body = await clone.text();

	return verify(body, signature, timestamp, publicKey, subtleCrypto, algorithm);
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
export async function verify(
	rawBody: string | null | undefined,
	signature: string | null | undefined,
	timestamp: string | null | undefined,
	publicKey: string,
	subtleCrypto: SubtleCrypto,
	algorithm: SubtleCryptoImportKeyAlgorithm | string = PlatformAlgorithm.NewNode
) {
	if (timestamp == null || signature == null || rawBody == null) {
		return false;
	}

	const key = await getCryptoKey(publicKey, subtleCrypto, algorithm);
	const name = typeof algorithm === "string" ? algorithm : algorithm.name;

	const isVerified = await subtleCrypto.verify(
		name,
		key,
		hexStringToBinary(signature),
		encoder.encode(`${timestamp ?? ""}${rawBody}`)
	);

	return isVerified;
}
