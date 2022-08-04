// @ts-expect-error Crypto types are not defined yet
import crypto from "node:crypto";
import { isValidRequest as verifyRequest } from "./lib/verify";
export { hexToBinary, validate } from "./lib/verify";

export async function isValidRequest(
	request: Request,
	publicKey: string,
	algorithm: SubtleCryptoImportKeyAlgorithm | string = "Ed25519"
) {
	return verifyRequest(request, publicKey, crypto.subtle, algorithm);
}
