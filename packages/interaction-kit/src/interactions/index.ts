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
	APIInteraction,
	APIMessageComponentInteraction,
	InteractionType,
	Utils,
} from "discord-api-types/v10";
import Option, { isAutocompleteOption } from "../commands/options/option";
import { StringOption, NumberOption, IntegerOption } from "../commands/options";

// TODO: Ask Vlad if we can get a version of discord-api-types that doesn't nest this under Utils so we can import it natively with modules
const {
	isChatInputApplicationCommandInteraction,
	isContextMenuApplicationCommandInteraction,
	isMessageComponentButtonInteraction,
	isMessageComponentSelectMenuInteraction,
} = Utils;

export function isAutocompleteExecutableOption(
	option: Option | undefined
): option is StringOption | NumberOption | IntegerOption {
	if (option == null) {
		return false;
	}

	return (
		option instanceof StringOption ||
		option instanceof NumberOption ||
		option instanceof IntegerOption
	);
}

function isButtonComponent(
	component: ExecutableComponent
): component is Button {
	return component instanceof Button;
}

function isSelectComponent(
	component: ExecutableComponent
): component is Select {
	return component instanceof Select;
}

async function handleApplicationCommandInteraction(
	application: Application,
	command: InteractionKitCommand<ApplicationCommandInteraction>,
	json: RequestBody<APIApplicationCommandInteraction>,
	respond: ResponseHandler
) {
	if (isChatInputApplicationCommandInteraction(json)) {
		const interaction = new SlashCommandInteraction(
			application,
			command,
			json,
			respond
		);

		// TODO: Handle subcommand interaction
		console.log(`Handling ${interaction.name}`);
		command.handler(interaction, application);
	} else if (isContextMenuApplicationCommandInteraction(json)) {
		const interaction = new ContextMenuInteraction(
			application,
			command,
			json,
			respond
		);

		console.log(`Handling ${interaction.name}`);
		command.handler(interaction, application);
	} else {
		throw new Error(
			// @ts-expect-error TS doesn't think this will happen, but theoretically it can
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
			`Unknown Application Command type: ${json.data.type ?? "[unknown]"}`
		);
	}
}

async function handleMessageComponentInteraction(
	application: Application,
	component: ExecutableComponent,
	json: RequestBody<APIMessageComponentInteraction>,
	respond: ResponseHandler
) {
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

		console.log(`Handling ${interaction.customId}`);
		component.handler(interaction, application);
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

		console.log(`Handling ${interaction.customId}`);
		component.handler(interaction, application);
	} else {
		throw new Error(
			`Unknown Interaction Component type (${
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
				json.data.component_type ?? "[unknown]"
			}) or component mismatch. `
		);
	}
}

export async function handler(
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

			if (command == null) {
				throw new Error("Unknown Command");
			}

			return handleApplicationCommandInteraction(
				application,
				command,
				json,
				respond
			);
		}

		// TODO: Handle subcommand option autocompletes
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
				option.autocomplete != null
			) {
				return option.autocomplete(interaction, application);
			}

			return command?.autocomplete?.(interaction, application);
		}

		case InteractionType.MessageComponent: {
			const component =
				application.getComponent(json.data.custom_id) ??
				(await application.findComponent(json.data.custom_id));

			if (component == null) {
				throw new Error("Could not find matching component");
			}

			return handleMessageComponentInteraction(
				application,
				component,
				json,
				respond
			);
		}

		default:
			throw new Error(`Unknown Interaction Type: ${json.type ?? "[unknown]"}`);
	}
}
