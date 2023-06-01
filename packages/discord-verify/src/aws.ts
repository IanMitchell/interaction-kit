// AWS lambda requires an explicit crypto import.
import crypto from "crypto";
import { PlatformAlgorithm, verify } from "./lib/verify.js";

export interface AWSGatewayEvent {
	headers: Record<string, string>;
	body: string;
}

/**
 * Validates a request from Discord received via AWS lambda.
 * @param event The AWS Gateway event to verify
 * @param publicKey - The application's public key
 * @param algorithm - The name of the crypto algorithm to use
 * @returns Whether the request is valid or not
 */
export async function isValid(
	event: AWSGatewayEvent,
	publicKey: string,
	algorithm?: string
) {
	const signature = event.headers["X-Signature-Ed25519"];
	const timestamp = event.headers["X-Signature-Timestamp"];
	const body = event.body;
	if (!signature || !timestamp || !body) return false;

	try {
		await verify(
			event.body,
			signature,
			timestamp,
			publicKey,
			crypto.webcrypto.subtle,
			algorithm ?? PlatformAlgorithm.OldNode
		);
	} catch (error: unknown) {
		if (error instanceof Error && error.constructor.name === "DOMException") {
			return verify(
				event.body,
				signature,
				timestamp,
				publicKey,
				crypto.webcrypto.subtle,
				algorithm ?? PlatformAlgorithm.OldNode
			);
		}

		throw error;
	}
}
