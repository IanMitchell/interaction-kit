import Option from "./options/option";
import { ArrayValue, InteractionKitCommand, Optional } from "../interfaces";
import SlashCommandInteraction from "../interactions/application-commands/slash-command-interaction";
import {
	APIApplicationCommand,
	ApplicationCommandType,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord-api-types/v10";
import SlashCommandAutocompleteInteraction from "../interactions/autocomplete/application-command-autocomplete";
import { Autocomplete } from "../interactions/autocomplete/types";
import Subcommand from "./options/subcommand";
import { SubcommandGroup } from "./options";

export type CommandArgs = {
	name: string;
	description: string;
	options?: Option[];
	handler: InteractionKitCommand<SlashCommandInteraction>["handler"];
	autocomplete?: never;
	commands?: never;
};

// TODO: Rename?
export type ParentCommandArgs = {
	name: string;
	description: string;
	options?: never;
	handler?: never;
	autocomplete?: never;
	commands: Array<Subcommand | SubcommandGroup>;
};

export type AutocompleteCommandArgs = CommandArgs & {
	options?: never;
	autocomplete?: Autocomplete<SlashCommandAutocompleteInteraction>["autocomplete"];
};

export default class SlashCommand
	implements
		Optional<InteractionKitCommand<SlashCommandInteraction>, "handler">,
		Autocomplete<SlashCommandAutocompleteInteraction>
{
	public readonly type = ApplicationCommandType.ChatInput;

	name: string;
	#description: string;
	options: Map<string, Option>;

	handler?: InteractionKitCommand<SlashCommandInteraction>["handler"];

	autocomplete?: Autocomplete<SlashCommandAutocompleteInteraction>["autocomplete"];
	commands: Map<string, ArrayValue<ParentCommandArgs["commands"]>>;

	constructor({
		name,
		description,
		options,
		handler,
		autocomplete,
		commands,
	}: CommandArgs | ParentCommandArgs | AutocompleteCommandArgs) {
		// TODO: Validate: 1-32 lowercase character name matching ^[\w-]{1,32}$
		this.name = name;
		this.#description = description;
		this.options = new Map();
		this.handler = handler;
		this.autocomplete = autocomplete;
		this.commands = new Map(commands?.map((cmd) => [cmd.name, cmd]));

		options?.forEach((option) => {
			const key = option.name.toLowerCase();
			if (this.options.has(key)) {
				throw new Error(
					`Option names must be unique (case insensitive). Duplicate name detected: ${key}`
				);
			}

			this.options.set(key, option);
		});
	}

	equals(schema: APIApplicationCommand): boolean {
		if (this.name !== schema.name || this.#description !== schema.description) {
			return false;
		}

		if (this.options.size !== (schema.options?.length ?? 0)) {
			return false;
		}

		return (
			schema.options?.every(
				(option) => this.options.get(option.name)?.equals(option) ?? false
			) ?? true
		);
	}

	serialize(): RESTPostAPIChatInputApplicationCommandsJSONBody {
		const payload: RESTPostAPIChatInputApplicationCommandsJSONBody = {
			name: this.name,
			description: this.#description,
		};

		// TODO: Sort these so that required options come first
		if (this.options.size > 0) {
			payload.options = [];

			Array.from(this.options.entries()).forEach(([_, value]) => {
				payload.options?.push(value.serialize());
			});
		}

		if (this.commands.size > 0) {
			payload.options = Array.from(this.commands.values()).map((cmd) =>
				cmd.serialize()
			);
		}

		return payload;
	}
}
