import fastify, { FastifyRequest, FastifyReply } from "fastify";
import rawBody from "fastify-raw-body";
import { Interaction } from "./definitions";
import { validateRequest } from "./requests/validate";

export default function startInteractionKitServer(
	handler: (
		request: FastifyRequest<{ Body: Interaction }>,
		response: FastifyReply
	) => unknown,
	publicKey: string,
	port = 3000
) {
	const server = fastify();

	void server.register(rawBody, {
		runFirst: true,
	});

	server.addHook("preHandler", async (request, response) => {
		if (request.method === "POST") {
			if (!validateRequest(request, publicKey)) {
				console.log("Invalid Discord Request");
				return response.status(401).send({ error: "Bad request signature " });
			}
		}
	});

	server.post<{ Body: Interaction }>("/", async (request, response) => {
		handler(request, response);
	});

	server.listen(port, async (error, address) => {
		if (error) {
			console.error(error);
			process.exit(1);
		}

		console.log(`Server listening on ${address}`);
	});
}
