import { FastifyReply, FastifyRequest } from "fastify";
import Application from "../../application";
import {
	ComponentType,
	Interaction as InteractionDefinition,
} from "../../definitions";
import { SerializableComponent } from "../../interfaces";
import SelectInteraction from "./select-interaction";
import MessageComponentInteraction from "../message-component-interaction";
import ButtonInteraction from "./button-interaction";

export function createComponentInteraction(
	application: Application,
	component: SerializableComponent,
	request: FastifyRequest<{ Body: InteractionDefinition }>,
	response: FastifyReply
): MessageComponentInteraction {
	switch (request?.body?.data?.component_type) {
		case ComponentType.BUTTON:
			return new ButtonInteraction(application, component, request, response);
		case ComponentType.SELECT:
			return new SelectInteraction(application, component, request, response);
		default:
			throw new Error(
				`Unknown Interaction Component type: ${
					request?.body?.data?.component_type ?? "[unknown]"
				}`
			);
	}
}
