import crypto from "node:crypto";
import type { APIInteraction } from "discord-api-types/v10";
import type { NextFunction, Request, Response } from "express";
import { verify, PlatformAlgorithm } from "../node.js";
import type { SubtleCryptoImportKeyAlgorithm } from "../types/index.js";

/**
 * Returns middleware for Express.js that validates a request from Discord.
 * If you are not on the latest version 16 or 18 of Node, you should pass a
 * specific value in for the algorithm.
 *
 * The returned middleware should be called before any other middleware, and
 * functionally works the same as a body parser middleware such as
 * `express.json`.
 *
 * @param publicKey - The application's public key
 * @param algorithm - The name of the crypto algorithm to use
 * @returns An express.js middleware function that verifies a request from Discord.
 */
export default function verifyInteraction(
	publicKey: string,
	algorithm: SubtleCryptoImportKeyAlgorithm | string = PlatformAlgorithm.NewNode
) {
	if (!publicKey) {
		throw new Error("You must specify a Public Key.");
	}

	return async function (req: Request, res: Response, next: NextFunction) {
		const timestamp = req.header("X-Signature-Timestamp") ?? "";
		const signature = req.header("X-Signature-Ed25519") ?? "";

		const chunks: Buffer[] = [];
		req.on("data", (chunk: Buffer) => {
			chunks.push(chunk);
		});
		req.on("end", async () => {
			const body = Buffer.concat(chunks).toString("utf-8");
			if (
				!(await verify(
					body,
					signature,
					timestamp,
					publicKey,
					crypto.webcrypto.subtle,
					algorithm ?? PlatformAlgorithm.OldNode
				))
			) {
				res.status(401).send("[discord-verify] Invalid signature");
				return;
			}

			req.body = JSON.parse(body) as APIInteraction;
			next();
		});
	};
}
