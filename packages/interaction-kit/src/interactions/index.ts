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
import SlashCommandAutocompleteInteraction from "./autocomplete/application-command-autocomplete";
import {
	APIApplicationCommandInteraction,
	APIChatInputApplicationCommandInteraction,
	APIContextMenuInteraction,
	APIInteraction,
	APIMessageComponentInteraction,
	ApplicationCommandType,
	ComponentType,
	InteractionType,
	APIMessageComponentButtonInteraction,
	APIMessageComponentSelectMenuInteraction,
} from "discord-api-types/v9";

function isChatInputApplicationCommandInteraction(
	interaction: APIApplicationCommandInteraction
): interaction is APIChatInputApplicationCommandInteraction {
	return interaction.data.type === ApplicationCommandType.ChatInput;
}

function isContextMenuApplicationCommandInteraction(
	interaction: APIApplicationCommandInteraction
): interaction is APIContextMenuInteraction {
	return (
		interaction.data.type === ApplicationCommandType.Message ||
		interaction.data.type === ApplicationCommandType.User
	);
}

function isMessageComponentButtonInteraction(
	interaction: APIMessageComponentInteraction
): interaction is APIMessageComponentButtonInteraction {
	return interaction.data.component_type === ComponentType.Button;
}

function isMessageComponentSelectMenuInteraction(
	interaction: APIMessageComponentInteraction
): interaction is APIMessageComponentSelectMenuInteraction {
	return interaction.data.component_type === ComponentType.SelectMenu;
}

function handleApplicationCommandInteraction(
	application: Application,
	command: InteractionKitCommand<ApplicationCommandInteraction> | undefined,
	json: RequestBody<APIApplicationCommandInteraction>,
	respond: ResponseHandler
) {
	if (command == null) {
		throw new Error("Unknown Command");
	}

	if (isChatInputApplicationCommandInteraction(json)) {
		const interaction = new SlashCommandInteraction(
			application,
			command,
			json,
			respond
		);

		console.log(`Handling ${interaction.name}`);
		command.onInteraction(interaction, application);
	} else if (isContextMenuApplicationCommandInteraction(json)) {
		const interaction = new ContextMenuInteraction(
			application,
			command,
			json,
			respond
		);

		console.log(`Handling ${interaction.name}`);
		command.onInteraction(interaction, application);
	} else {
		throw new Error(
			// @ts-expect-error TS doesn't think this will happen, but theoretically it can
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
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

	if (isMessageComponentButtonInteraction(json)) {
		const interaction = new ButtonInteraction(
			application,
			component as Button,
			json,
			respond
		);

		console.log(`Handling ${interaction.customID}`);
		(component as Button).handler(interaction, application);
	} else if (isMessageComponentSelectMenuInteraction(json)) {
		const interaction = new SelectInteraction(
			application,
			component as Select,
			json,
			respond
		);

		console.log(`Handling ${interaction.customID}`);
		(component as Select).handler(interaction, application);
	} else {
		throw new Error(
			`Unknown Interaction Component type: ${
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
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
			const command = application.getCommand(json.data.type, json.data.name);
			handleApplicationCommandInteraction(application, command, json, respond);
			break;
		}

		case InteractionType.ApplicationCommandAutocomplete: {
			const command = application.getCommand(json.data.type, json.data.name);
			const interaction = new SlashCommandAutocompleteInteraction(
				application,
				command,
				json,
				respond
			);

			console.log(`Handling ${interaction.name} Autocomplete`);
			// TODO: Check for active option on command. Does it have onAutocomplete? Call that. Otherwise....
			command.onAutocomplete?.(interaction, application);
			break;
		}

		case InteractionType.MessageComponent: {
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
