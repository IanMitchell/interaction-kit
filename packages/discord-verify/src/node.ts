// eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
// @ts-ignore-error Node Crypto types are not well defined yet
import crypto from "node:crypto";
import { isValidRequest as verifyRequest } from "./lib/verify";
import type {
	Request,
	SubtleCrypto,
	SubtleCryptoImportKeyAlgorithm,
} from "./types";
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
	return verifyRequest(
		request,
		publicKey,
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
		// @ts-ignore-error Node Crypto types are not well defined yet
		crypto.subtle as SubtleCrypto,
		algorithm
	);
}
