import type { APIInteraction } from "discord-api-types/v10";
import {
	InteractionResponseType,
	InteractionType,
} from "discord-api-types/v10";
import { verify } from "discord-verify/node";
import type { FastifyReply, FastifyRequest } from "fastify";
import fastify from "fastify";
import crypto from "node:crypto";

const PUBLIC_KEY = "123abc";

const server = fastify({
	logger: true,
});

// Declare a route
server.post(
	"/",
	async (
		request: FastifyRequest<{
			Body: APIInteraction;
			Headers: {
				"x-signature-ed25519": string;
				"x-signature-timestamp": string;
			};
		}>,
		reply: FastifyReply
	) => {
		// Verify Request is from Discord
		const signature = request.headers["x-signature-ed25519"];
		const timestamp = request.headers["x-signature-timestamp"];
		const rawBody = JSON.stringify(request.body);

		const isValidRequest = await verify(
			rawBody,
			signature,
			timestamp,
			PUBLIC_KEY,
			// @ts-expect-error crypto types suck
			crypto.subtle
		);

		if (!isValidRequest) {
			return reply.code(401).send("Invalid signature");
		}

		const interaction = request.body;

		if (interaction.type === InteractionType.Ping) {
			return reply.send({ type: InteractionResponseType.Pong });
		}

		await reply.send({ content: "Hello World!", flags: 1 << 6 });
	}
);

server.listen({ port: 3000 }, (err, address) => {
	if (err) {
		server.log.error(err);
		process.exit(1);
	}

	console.log(`Listening on ${address}`);
});
