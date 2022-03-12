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
import {
	isAutocompleteExecutableOption,
	isAutocompleteOption,
} from "../commands/options/option";

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

function isButtonComponent(
	component: ExecutableComponent
): component is Button {
	return component instanceof Button;
}

function isMessageComponentSelectMenuInteraction(
	interaction: APIMessageComponentInteraction
): interaction is APIMessageComponentSelectMenuInteraction {
	return interaction.data.component_type === ComponentType.SelectMenu;
}

function isSelectComponent(
	component: ExecutableComponent
): component is Select {
	return component instanceof Select;
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

	if (
		isMessageComponentButtonInteraction(json) &&
		isButtonComponent(component)
	) {
		const interaction = new ButtonInteraction(
			application,
			component,
			json,
			respond
		);

		console.log(`Handling ${interaction.customID}`);
		component.onInteraction(interaction, application);
	} else if (
		isMessageComponentSelectMenuInteraction(json) &&
		isSelectComponent(component)
	) {
		const interaction = new SelectInteraction(
			application,
			component,
			json,
			respond
		);

		console.log(`Handling ${interaction.customID}`);
		component.onInteraction(interaction, application);
	} else {
		throw new Error(
			`Unknown Interaction Component type (${
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
				json.data.component_type ?? "[unknown]"
			}) or component mismatch. `
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
			// Safe to cast, related to `application.ts#L103`
			const command = application.getCommand(json.data.type, json.data.name) as
				| InteractionKitCommand<ApplicationCommandInteraction>
				| undefined;

			handleApplicationCommandInteraction(application, command, json, respond);

			break;
		}

		case InteractionType.ApplicationCommandAutocomplete: {
			const command = application.getCommand(json.data.type, json.data.name);

			if (command == null) {
				throw new Error("Unknown Command");
			}

			const interaction = new SlashCommandAutocompleteInteraction(
				application,
				command,
				json,
				respond
			);

			console.log(`Handling ${interaction.name} Autocomplete`);
			const focused = json.data.options.find((option) => {
				if (isAutocompleteOption(option)) {
					return option.focused;
				}

				return false;
			});

			if (focused == null) {
				throw new Error("No focused option");
			}

			const option = command.options.get(focused.name);

			if (
				isAutocompleteExecutableOption(option) &&
				option.onAutocomplete != null
			) {
				option.onAutocomplete(interaction, application);
			} else {
				command?.onAutocomplete?.(interaction, application);
			}

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
