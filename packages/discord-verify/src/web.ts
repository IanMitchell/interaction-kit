import { isValidRequest as verifyRequest } from "./lib/verify";
export { hexToBinary, PlatformAlgorithm, validate } from "./lib/verify";

export async function isValidRequest(
	request: Request,
	publicKey: string,
	algorithm: SubtleCryptoImportKeyAlgorithm | string = "Ed25519"
) {
	return verifyRequest(request, publicKey, crypto.subtle, algorithm);
}
