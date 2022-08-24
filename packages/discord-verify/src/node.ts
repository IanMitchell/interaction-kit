// eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
// @ts-ignore-error We can't use Node types since we aren't fully in a Node environment
import crypto from "node:crypto";
import {
	isValidRequest as verifyRequest,
	PlatformAlgorithm,
} from "./lib/verify";
import type { Request, SubtleCryptoImportKeyAlgorithm } from "./types";
export { hexStringToBinary, PlatformAlgorithm, verify } from "./lib/verify";

/**
 * Validates a request from Discord. If you are not on the latest
 * version 16 or 18 of Node, you should pass a specific value in for
 * the algorithm. The request should not be consumed prior
 * to calling this function.
 * @param request Request to verify. This should not have been consumed yet.
 * @param publicKey The application's public key
 * @param algorithm The name of the crypto algorithm to use
 * @returns Whether the request is valid or not
 */
export async function isValidRequest(
	request: Request,
	publicKey: string,
	algorithm?: SubtleCryptoImportKeyAlgorithm | string
) {
	try {
		return await verifyRequest(
			request,
			publicKey,
			crypto.webcrypto.subtle,
			algorithm ?? PlatformAlgorithm.NewNode
		);
	} catch (error: unknown) {
		if (error instanceof Error && error.constructor.name === "DOMException") {
			return verifyRequest(
				request,
				publicKey,
				crypto.webcrypto.subtle,
				algorithm ?? PlatformAlgorithm.OldNode
			);
		}

		throw error;
	}
}
