// @ts-expect-error Crypto types are not defined yet
import crypto from "node:crypto";
import { isValidRequest as validate } from "./verify";
export { hexToBinary } from "./verify";

export async function isValidRequest(
	request: Request,
	publicKey: string,
	algorithm: SubtleCryptoImportKeyAlgorithm | string = "Ed25519"
) {
	return validate(request, publicKey, crypto.subtle, algorithm);
}
