// eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
// @ts-ignore-error Node Crypto types are not well defined yet
import crypto from "node:crypto";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
// @ts-ignore-error Node Process
import process from "node:process";
import {
	isValidRequest as verifyRequest,
	PlatformAlgorithm,
} from "./lib/verify";
import type {
	Request,
	SubtleCrypto,
	SubtleCryptoImportKeyAlgorithm,
} from "./types";
export { hexStringToBinary, PlatformAlgorithm, verify } from "./lib/verify";

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
	algorithm?: SubtleCryptoImportKeyAlgorithm | string
) {
	const [majorVersion] = process.versions.node.split(".");
	const algo =
		majorVersion >= 18 ? PlatformAlgorithm.Node18 : PlatformAlgorithm.Node16;
	const subtleCrypto =
		majorVersion >= 18
			? (crypto.subtle as SubtleCrypto)
			: (crypto.webcrypto.subtle as SubtleCrypto);

	return verifyRequest(request, publicKey, subtleCrypto, algorithm ?? algo);
}
