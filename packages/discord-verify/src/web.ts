import {
	isValidRequest as verifyRequest,
	PlatformAlgorithm,
} from "./lib/verify.js";
import type {
	Request,
	SubtleCrypto,
	SubtleCryptoImportKeyAlgorithm,
} from "./types/index.js";
export { hexStringToBinary, PlatformAlgorithm, verify } from "./lib/verify.js";

declare const crypto: {
	subtle: SubtleCrypto;
};

/**
 * Validates a request from Discord. The request should not be consumed prior
 * to calling this function.
 * @param request - Request to verify. This should not have been consumed yet.
 * @param publicKey - The application's public key
 * @param algorithm - The name of the crypto algorithm to use
 * @returns Whether the request is valid or not
 */
export async function isValidRequest(
	request: Request,
	publicKey: string,
	algorithm: SubtleCryptoImportKeyAlgorithm | string = PlatformAlgorithm.Web
) {
	return verifyRequest(request, publicKey, crypto.subtle, algorithm);
}
