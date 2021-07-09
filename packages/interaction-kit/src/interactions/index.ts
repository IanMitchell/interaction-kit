import Application from "../application";
import type { FastifyRequest, FastifyReply } from "fastify";
import {
	Interaction as InteractionDefinition,
	InteractionRequestType,
} from "../definitions";
import ApplicationCommandInteraction from "./application-command-interaction";
import MessageComponentInteraction from "./message-component-interaction";
import PingInteraction from "./ping-interaction";

export function create(
	application: Application,
	request: FastifyRequest<{ Body: InteractionDefinition }>,
	response: FastifyReply
) {
	switch (request?.body?.type) {
		case InteractionRequestType.PING:
			return new PingInteraction();
		case InteractionRequestType.APPLICATION_COMMAND:
			return new ApplicationCommandInteraction(application, request, response);
		case InteractionRequestType.MESSAGE_COMPONENT:
			return new MessageComponentInteraction(application, request, response);
		default:
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			throw new Error(`Unknown Interaction Type: ${request?.body?.type}`);
	}
}
