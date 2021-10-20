import Application from "../application";
import type { FastifyRequest, FastifyReply } from "fastify";
import {
	ApplicationCommandType,
	ComponentType,
	Interaction as InteractionDefinition,
	InteractionCallbackType,
	InteractionRequestType,
} from "../definitions";
import ButtonInteraction from "./message-components/button-interaction";
import SelectInteraction from "./message-components/select-interaction";
import SlashCommandInteraction from "./application-commands/slash-command-interaction";
import ContextMenuInteraction from "./application-commands/context-menu-interaction";
import { ExecutableComponent } from "../components";
import { Button } from "../components/button";
import Select from "../components/select";
import { InteractionKitCommand } from "../interfaces";
import { ApplicationCommandInteraction, PingInteraction } from "..";

function handleApplicationCommandInteraction(
	application: Application,
	command: InteractionKitCommand<ApplicationCommandInteraction> | undefined,
	request: FastifyRequest<{ Body: InteractionDefinition }>,
	response: FastifyReply
) {
	if (command == null) {
		throw new Error("Unknown Command");
	}

	switch (request.body.data?.type) {
		case ApplicationCommandType.CHAT_INPUT: {
			const interaction = new SlashCommandInteraction(
				application,
				command,
				request,
				response
			);

			console.log(`Handling ${interaction.name}`);
			command.handler(interaction, application);
			break;
		}

		case ApplicationCommandType.MESSAGE:
		case ApplicationCommandType.USER: {
			const interaction = new ContextMenuInteraction(
				application,
				command,
				request,
				response
			);

			console.log(`Handling ${interaction.name}`);
			command.handler(interaction, application);
			break;
		}

		default:
			throw new Error(
				`Unknown Application Command type: ${
					request.body.data?.type ?? "[unknown]"
				}`
			);
	}
}

function handleMessageComponentInteraction(
	application: Application,
	component: ExecutableComponent | undefined,
	request: FastifyRequest<{ Body: InteractionDefinition }>,
	response: FastifyReply
) {
	if (component == null) {
		throw new Error("Unknown Component");
	}

	switch (request?.body?.data?.component_type) {
		case ComponentType.BUTTON: {
			const interaction = new ButtonInteraction(
				application,
				component as Button,
				request,
				response
			);

			console.log(`Handling ${interaction.customID}`);
			(component as Button).handler(interaction, application);
			break;
		}

		case ComponentType.SELECT: {
			const interaction = new SelectInteraction(
				application,
				component as Select,
				request,
				response
			);

			console.log(`Handling ${interaction.customID}`);
			(component as Select).handler(interaction, application);
			break;
		}

		default:
			throw new Error(
				`Unknown Interaction Component type: ${
					request?.body?.data?.component_type ?? "[unknown]"
				}`
			);
	}
}

export function handler(
	application: Application,
	request: FastifyRequest<{ Body: InteractionDefinition }>,
	response: FastifyReply
) {
	if (request?.body?.data?.custom_id == null) {
		throw new Error("Received interaction without Custom ID");
	}

	switch (request?.body?.type) {
		case InteractionRequestType.PING: {
			console.log("Handling Discord Ping");
			new PingInteraction(application, request, response).handler();
			break;
		}

		case InteractionRequestType.APPLICATION_COMMAND: {
			const command = application.getCommand(
				request?.body?.data?.type,
				request?.body?.data?.custom_id
			);
			handleApplicationCommandInteraction(
				application,
				command,
				request,
				response
			);
			break;
		}

		case InteractionRequestType.MESSAGE_COMPONENT: {
			const component = application.getComponent(
				request?.body?.data?.custom_id
			);

			handleMessageComponentInteraction(
				application,
				component,
				request,
				response
			);
			break;
		}

		default:
			throw new Error(
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				`Unknown Interaction Type: ${request?.body?.type ?? "[unknown]"}`
			);
	}
}
