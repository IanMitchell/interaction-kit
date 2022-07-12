import {
	APIApplicationCommandSubcommandOption,
	ApplicationCommandOptionType,
} from "discord-api-types/v10";
import SlashCommandInteraction from "../../interactions/application-commands/slash-command-interaction";
import SlashCommandAutocompleteInteraction from "../../interactions/autocomplete/application-command-autocomplete";
import { Autocomplete } from "../../interactions/autocomplete/types";
import { InteractionKitCommand } from "../../interfaces";
import { AutocompleteCommandArgs, CommandArgs } from "../slash-command";
import { BasicOption, Option } from "./option";

export default class Subcommand
	extends Option
	implements
		Omit<
			InteractionKitCommand<SlashCommandInteraction>,
			"type" | "serialize" | "equals"
		>,
		Autocomplete<SlashCommandAutocompleteInteraction>
{
	public readonly type = ApplicationCommandOptionType.Subcommand;

	options: Map<string, BasicOption>;
	handler: InteractionKitCommand<SlashCommandInteraction>["handler"];
	autocomplete?:
		| Autocomplete<SlashCommandAutocompleteInteraction>["autocomplete"];

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
		});

		// TODO: This is somewhat shared with SlashCommand.
		// TODO: Validate: 1-32 lowercase character name matching ^[\w-]{1,32}$
		this.options = new Map();
		this.handler = handler;
		if (autocomplete != null) this.autocomplete = autocomplete;

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

	equals(schema: APIApplicationCommandSubcommandOption): boolean {
		if (!super.equals(schema)) {
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
		const payload = super.serialize() as APIApplicationCommandSubcommandOption;

		// TODO: Sort these so that required options come first
		if (this.options.size > 0) {
			payload.options = Array.from(this.options.values()).map((option) =>
				option.serialize()
			);
		}

		return payload;
	}
}
