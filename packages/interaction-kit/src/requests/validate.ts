import { webcrypto } from "crypto";
import type { FastifyRequest } from "fastify";
import { TextEncoder } from "util";

const encoder = new TextEncoder();

export function hexToBinary(hex: string) {
	const buffer = new Uint8Array(Math.ceil(hex.length / 2));
	for (let i = 0; i < buffer.length; i++) {
		buffer[i] = parseInt(hex.substr(i * 2, 2), 16);
	}

	return buffer;
}

export async function validateRequest(
	request: FastifyRequest,
	publicKey: string
) {
	const signature = hexToBinary(
		request.headers["x-signature-ed25519"] as string
	);
	const timestamp = request.headers["x-signature-timestamp"] as string;
	const body = request.rawBody as string;

	const key = async (key: string) =>
		// @ts-expect-error ????
		webcrypto.subtle.importKey(
			"raw",
			hexToBinary(key),
			{
				name: "NODE-ED25519",
				namedCurve: "NODE-ED25519",
				public: true,
			},
			true,
			["verify"]
		);

	// @ts-expect-error ????
	const isVerified = webcrypto.subtle.verify(
		"NODE-ED25519",
		await key(publicKey),
		signature,
		encoder.encode(timestamp + body)
	);

	if (
		signature == null ||
		timestamp == null ||
		body == null ||
		!(await isVerified)
	) {
		return false;
	}

	return true;
}
