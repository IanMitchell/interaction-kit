import {
	APIApplicationCommandOption,
	APIApplicationCommandSubcommandOption,
	ApplicationCommandOptionType,
} from "discord-api-types/v10";
import SlashCommandInteraction from "../../interactions/application-commands/slash-command-interaction";
import SlashCommandAutocompleteInteraction from "../../interactions/autocomplete/application-command-autocomplete";
import { Autocomplete } from "../../interactions/autocomplete/types";
import { InteractionKitCommand } from "../../interfaces";
import { AutocompleteCommandArgs, CommandArgs } from "../slash-command";
import Option, { BaseOptionArgs } from "./option";

export default class Subcommand
	extends Option
	implements
		Omit<InteractionKitCommand<SlashCommandInteraction>, "type" | "serialize">,
		Autocomplete<SlashCommandAutocompleteInteraction>
{
	public readonly type = ApplicationCommandOptionType.Subcommand;

	options: Map<string, Option>;
	handler: InteractionKitCommand<SlashCommandInteraction>["handler"];
	autocomplete:
		| Autocomplete<SlashCommandAutocompleteInteraction>["autocomplete"]
		| undefined;

	constructor({
		name,
		description,
		options,
		handler,
		autocomplete,
	}: CommandArgs | AutocompleteCommandArgs) {
		super({
			type: ApplicationCommandOptionType.Subcommand,
			name,
			description,
			required: undefined,
		});

		// TODO: This is somewhat shared with SlashCommand.
		// TODO: Validate: 1-32 lowercase character name matching ^[\w-]{1,32}$
		this.options = new Map();
		this.handler = handler;
		this.autocomplete = autocomplete;

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

	// TODO: ?????
	equals(schema: APIApplicationCommandSubcommandOption): boolean {
		if (this.name !== schema.name || this.description !== schema.description) {
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

	serialize(): APIApplicationCommandSubcommandOption {
		const payload: APIApplicationCommandSubcommandOption = super.serialize();

		// TODO: Sort these so that required options come first
		if (this.options.size > 0) {
			payload.options = Array.from(this.options.values()).map((option) =>
				option.serialize()
			);
		}

		return payload;
	}
}
