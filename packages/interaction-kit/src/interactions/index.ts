import Application from "../application";
import type { FastifyRequest, FastifyReply } from "fastify";
import {
	Interaction as InteractionDefinition,
	InteractionRequestType,
} from "../definitions";
import ApplicationCommandInteraction from "./application-command-interaction";
import MessageComponentInteraction from "./message-component-interaction";
import PingInteraction from "./ping-interaction";
import { createComponentInteraction } from "./components";

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
		case InteractionRequestType.MESSAGE_COMPONENT: {
			const component = application.getComponent(
				request?.body?.data?.custom_id
			);
			return createComponentInteraction(
				application,
				component,
				request,
				response
			);
		}
		default:
			throw new Error(
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				`Unknown Interaction Type: ${request?.body?.type ?? "[unknown]"}`
			);
	}
}
