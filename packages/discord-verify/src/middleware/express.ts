import crypto from "node:crypto";
import {
  verify,
  PlatformAlgorithm
} from "../node.ts";
import type { SubtleCryptoKeyAlgorithm } from "../types/index.js";
import type { NextFunction, Request, Response } from "@types/express";

/**
 * Returns middleware for Express.js that validates a request from Discord.
 * If you are not on the latest version 16 or 18 of Node, you should pass a
 * specific value in for the algorithm.
 *
 * The returned middleware should be called before any other middleware, and
 * functionally works the same as a body parser middleware such as
 * `express.json`.
 *
 * @param publicKey The application's public key
 * @param algorithm The name of the crypto algorithm to use
 * @returns An express.js middleware function that verifies a request from Discord.
 */
export default function getMiddleware(
	publicKey: string,
	algorithm: SubtleCryptoImportKeyAlgorithm | string = PlatformAlgorithm.NewNode
) {
	if(!publicKey) {
		throw new Error("You must specify a Public Key.");
	}

	return async function(
		req: Request,
		res: Resposne,
		next: NextFunction
	) {
		const timestamp = req.header("X-Signature-Timestamp") || "";
		const signature = req.header("X-Signature-Ed25519") || "";

		const chunks = [];
		req.on('data', chunk => {
			chunks.push(chunk);
		});
		req.on('end', async () => {
			const body = Buffer.concat(chunks);
			if (!await verify(
				body,
				signature,
				timestamp,
				publicKey,
				crypto.webcrypto.subtle,
				algorithm ?? PlatformAlgorithm.OldNode)
			) {
				res.status(401).send('[discord-verify] Invalid signature');
				return;
			}

			req.body = JSON.parse(body.toString('utf-8')) || {};
			next();
		});
	}
}
