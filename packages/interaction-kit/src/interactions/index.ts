import Application from "../application";
import ButtonInteraction from "./message-components/button-interaction";
import SelectInteraction from "./message-components/select-interaction";
import SlashCommandInteraction from "./application-commands/slash-command-interaction";
import ContextMenuInteraction from "./application-commands/context-menu-interaction";
import { ExecutableComponent } from "../components";
import { Button } from "../components/button";
import Select from "../components/select";
import {
	InteractionKitCommand,
	RequestBody,
	ResponseHandler,
} from "../interfaces";
import { ApplicationCommandInteraction, PingInteraction } from "..";
import {
	APIApplicationCommandInteraction,
	APIInteraction,
	APIMessageComponentInteraction,
	ApplicationCommandType,
	ComponentType,
	InteractionType,
} from "discord-api-types/v9";

function handleApplicationCommandInteraction(
	application: Application,
	command: InteractionKitCommand<ApplicationCommandInteraction> | undefined,
	json: RequestBody<APIApplicationCommandInteraction>,
	respond: ResponseHandler
) {
	if (command == null) {
		throw new Error("Unknown Command");
	}

	switch (json.data.type) {
		case ApplicationCommandType.ChatInput: {
			const interaction = new SlashCommandInteraction(
				application,
				command,
				json,
				respond
			);

			console.log(`Handling ${interaction.name}`);
			command.handler(interaction, application);
			break;
		}

		case ApplicationCommandType.Message:
		case ApplicationCommandType.User: {
			const interaction = new ContextMenuInteraction(
				application,
				command,
				json,
				respond
			);

			console.log(`Handling ${interaction.name}`);
			command.handler(interaction, application);
			break;
		}

		default:
			throw new Error(
				`Unknown Application Command type: ${json.data.type ?? "[unknown]"}`
			);
	}
}

function handleMessageComponentInteraction(
	application: Application,
	component: ExecutableComponent | undefined,
	json: RequestBody<APIMessageComponentInteraction>,
	respond: ResponseHandler
) {
	if (component == null) {
		throw new Error("Unknown Component");
	}

	switch (json.data.component_type) {
		case ComponentType.Button: {
			const interaction = new ButtonInteraction(
				application,
				component as Button,
				json,
				respond
			);

			console.log(`Handling ${interaction.customID}`);
			(component as Button).handler(interaction, application);
			break;
		}

		case ComponentType.SelectMenu: {
			const interaction = new SelectInteraction(
				application,
				component as Select,
				json,
				respond
			);

			console.log(`Handling ${interaction.customID}`);
			(component as Select).handler(interaction, application);
			break;
		}

		default:
			throw new Error(
				`Unknown Interaction Component type: ${
					json.data.component_type ?? "[unknown]"
				}`
			);
	}
}

export function handler(
	application: Application,
	json: RequestBody<APIInteraction>,
	respond: ResponseHandler
) {
	switch (json.type) {
		case InteractionType.Ping: {
			console.log("Handling Discord Ping");
			new PingInteraction(application, json, respond).handler();
			break;
		}

		case InteractionType.ApplicationCommand: {
			if (json.data.name == null) {
				throw new Error("Received interaction without Name");
			}

			const command = application.getCommand(json.data.type, json.data?.name);
			handleApplicationCommandInteraction(application, command, json, respond);
			break;
		}

		case InteractionType.MessageComponent: {
			if (json.data.custom_id == null) {
				throw new Error("Received interaction without Custom ID");
			}

			const component = application.getComponent(json.data.custom_id);

			handleMessageComponentInteraction(application, component, json, respond);
			break;
		}

		default:
			throw new Error(
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				`Unknown Interaction Type: ${json.type ?? "[unknown]"}`
			);
	}
}
