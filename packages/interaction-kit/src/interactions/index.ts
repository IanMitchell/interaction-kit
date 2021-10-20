import Application from "../application";
import type { FastifyRequest, FastifyReply } from "fastify";
import {
	ApplicationCommandType,
	ComponentType,
	Interaction as InteractionDefinition,
	InteractionRequestType,
} from "../definitions";
import PingInteraction from "./ping-interaction";
import ButtonInteraction from "./message-components/button-interaction";
import SelectInteraction from "./message-components/select-interaction";
import SlashCommandInteraction from "./application-commands/slash-command-interaction";
import ContextMenuInteraction from "./application-commands/context-menu-interaction";
import MessageComponentInteraction from "./message-components/message-component-interaction";
import { ExecutableComponent } from "../components";
import { Button } from "../components/button";
import Select from "../components/select";

function getApplicationCommandInteraction(
	application: Application,
	command: unknown, // TODO: Fix
	request: FastifyRequest<{ Body: InteractionDefinition }>,
	response: FastifyReply
) {
	switch (request.body.data?.type) {
		case ApplicationCommandType.CHAT_INPUT:
			return new SlashCommandInteraction(
				application,
				command,
				request,
				response
			);
		case ApplicationCommandType.MESSAGE:
		case ApplicationCommandType.USER:
			return new ContextMenuInteraction(
				application,
				command,
				request,
				response
			);
		default:
			throw new Error(
				`Unknown Application Command type: ${
					request.body.data?.type ?? "[unknown]"
				}`
			);
	}
}

function getMessageComponentInteraction(
	application: Application,
	component: ExecutableComponent | undefined,
	request: FastifyRequest<{ Body: InteractionDefinition }>,
	response: FastifyReply
): MessageComponentInteraction {
	switch (request?.body?.data?.component_type) {
		case ComponentType.BUTTON:
			return new ButtonInteraction(
				application,
				component as Button,
				request,
				response
			);
		case ComponentType.SELECT:
			return new SelectInteraction(
				application,
				component as Select,
				request,
				response
			);
		default:
			throw new Error(
				`Unknown Interaction Component type: ${
					request?.body?.data?.component_type ?? "[unknown]"
				}`
			);
	}
}

export function create(
	application: Application,
	request: FastifyRequest<{ Body: InteractionDefinition }>,
	response: FastifyReply
) {
	if (request?.body?.data?.custom_id == null) {
		throw new Error("Received interaction without Custom ID");
	}

	switch (request?.body?.type) {
		case InteractionRequestType.PING:
			return new PingInteraction();
		case InteractionRequestType.APPLICATION_COMMAND: {
			const command = application.getCommand(
				request?.body?.data?.type,
				request?.body?.data?.custom_id
			);
			return getApplicationCommandInteraction(
				application,
				command,
				request,
				response
			);
		}

		case InteractionRequestType.MESSAGE_COMPONENT: {
			const component = application.getComponent(
				request?.body?.data?.custom_id
			);
			return getMessageComponentInteraction(
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
