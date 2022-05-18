import {
	APIApplicationCommandInteractionDataBasicOption,
	APIApplicationCommandInteractionDataIntegerOption,
	APIApplicationCommandInteractionDataNumberOption,
	APIApplicationCommandInteractionDataOption,
	APIApplicationCommandInteractionDataStringOption,
	APIApplicationCommandOption,
	ApplicationCommandOptionType,
} from "discord-api-types/v10";
import { APIApplicationCommandOptionBase } from "discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/base";
import { Comparable, Serializable } from "../../interfaces";

type OptionArgs = {
	type: ApplicationCommandOptionType;
	name: string;
	description: string;
	required: boolean | undefined;
};

export type BaseOptionArgs = Omit<OptionArgs, "type" | "options">;

export type APIApplicationCommandInteractionDataAutocompleteOption =
	| APIApplicationCommandInteractionDataStringOption
	| APIApplicationCommandInteractionDataIntegerOption
	| APIApplicationCommandInteractionDataNumberOption;

export type AutocompleteOptionTypes =
	| AutocompleteCommandOptionType<ApplicationCommandOptionType.String>
	| AutocompleteCommandOptionType<ApplicationCommandOptionType.Number>
	| AutocompleteCommandOptionType<ApplicationCommandOptionType.Integer>;

// TODO: Upstream?
export function isBasicOption(
	option: APIApplicationCommandInteractionDataOption
): option is APIApplicationCommandInteractionDataBasicOption {
	return (
		option.type !== ApplicationCommandOptionType.Subcommand &&
		option.type !== ApplicationCommandOptionType.SubcommandGroup
	);
}

// TODO: Upstream?
export function isAutocompleteOption(
	option: APIApplicationCommandInteractionDataOption
): option is APIApplicationCommandInteractionDataAutocompleteOption {
	return (
		option.type === ApplicationCommandOptionType.String ||
		option.type === ApplicationCommandOptionType.Integer ||
		option.type === ApplicationCommandOptionType.Number
	);
}

export type AutocompleteCommandOptionType<
	T extends ApplicationCommandOptionType
> = APIApplicationCommandOptionBase<T> & {
	autocomplete: true;
};

export default class Option
	implements Serializable, Comparable<APIApplicationCommandOption>
{
	public readonly type;
	public readonly name;
	public readonly description;
	public readonly required;

	constructor({ type, name, description, required }: OptionArgs) {
		this.type = type;
		this.name = name;
		this.description = description;
		this.required = required;
	}

	isAutocomplete(
		_payload?: APIApplicationCommandOption
	): _payload is AutocompleteOptionTypes {
		return false;
	}

	serialize(): APIApplicationCommandOption {
		const payload: APIApplicationCommandOption = {
			type: this.type,
			name: this.name,
			description: this.description,
			required: this.required,
		};

		return payload;
	}

	equals(schema: APIApplicationCommandOption): boolean {
		if (
			this.type !== schema.type ||
			this.name !== schema.name ||
			this.description !== schema.description ||
			this.required !== (schema.required ?? false)
		) {
			return false;
		}

		return true;
	}
}
