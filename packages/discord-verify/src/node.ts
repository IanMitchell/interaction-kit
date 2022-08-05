// @ts-expect-error Crypto types are not defined yet
import crypto from "node:crypto";
import { isValidRequest as verifyRequest } from "./lib/verify";
export { hexToBinary, validate } from "./lib/verify";

/**
 * Validates a request from Discord
 * @param request Request to verify
 * @param publicKey The application's public key
 * @param algorithm The name of the crypto algorithm to use
 * @returns Whether the request is valid or not
 */
export async function isValidRequest(
	request: Request,
	publicKey: string,
	algorithm: SubtleCryptoImportKeyAlgorithm | string = "Ed25519"
) {
	return verifyRequest(request, publicKey, crypto.subtle, algorithm);
}
