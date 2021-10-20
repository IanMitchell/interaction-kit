import MessageComponentInteraction from "./message-component-interaction";
import type { FastifyReply, FastifyRequest } from "fastify";
import { Interaction as InteractionDefinition } from "../../definitions";
import Application from "../../application";
import { Button } from "../../components/button";

export default class ButtonInteraction extends MessageComponentInteraction {
	constructor(
		application: Application,
		component: Button,
		request: FastifyRequest<{ Body: InteractionDefinition }>,
		response: FastifyReply
	) {
		super(application, request, response);
	}
}
