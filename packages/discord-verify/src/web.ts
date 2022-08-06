import { isValidRequest as verifyRequest } from "./lib/verify";
import type {
	Request,
	SubtleCrypto,
	SubtleCryptoImportKeyAlgorithm,
} from "./types";
export { hexToBinary, PlatformAlgorithm, validate } from "./lib/verify";

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
	// @ts-expect-error We don't have this defined globally due to conflicts
	const subtleCrypto: SubtleCrypto = crypto.subtle;
	return verifyRequest(request, publicKey, subtleCrypto, algorithm);
}
