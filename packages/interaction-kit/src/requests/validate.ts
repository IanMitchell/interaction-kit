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

/* eslint-disable */
export function getPublicKey(publicKey: string) {
	// @ts-ignore ????
	return webcrypto.subtle.importKey(
		"raw",
		hexToBinary(publicKey),
		{
			name: "NODE-ED25519",
			namedCurve: "NODE-ED25519",
			public: true,
		},
		true,
		["verify"]
	);
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

	console.log({ signature, timestamp, body });

	let isVerified;
	try {
		const key = await getPublicKey(publicKey);
		console.log({ key });

		// @ts-ignore ????
		isVerified = await webcrypto.subtle.verify(
			"NODE-ED25519",
			key,
			signature,
			encoder.encode(timestamp + body)
		);
	} catch (error) {
		console.error(error);
	}
	console.log({ isVerified });

	if (signature == null || timestamp == null || body == null || !isVerified) {
		console.log("Failed to validate");
		return false;
	}

	console.log("Valid");
	return true;
}
/* eslint-enable */
