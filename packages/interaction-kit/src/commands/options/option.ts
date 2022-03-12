import {
	APIApplicationCommandBasicOption,
	APIApplicationCommandInteractionDataBasicOption,
	APIApplicationCommandInteractionDataIntegerOption,
	APIApplicationCommandInteractionDataNumberOption,
	APIApplicationCommandInteractionDataOption,
	APIApplicationCommandInteractionDataStringOption,
	APIApplicationCommandOption,
	ApplicationCommandOptionType,
} from "discord-api-types/payloads/v9";
import { APIApplicationCommandOptionBase } from "discord-api-types/payloads/v9/_interactions/_applicationCommands/_chatInput/base";
import { Comparable, Serializable } from "../../interfaces";
import IntegerOption from "./integer";
import NumberOption from "./number";
import StringOption from "./string";

type OptionArgs = {
	type: ApplicationCommandOptionType;
	name: string;
	description: string;
	required?: boolean;
	options?: APIApplicationCommandOption[];
};

export type BaseOptionArgs = Omit<OptionArgs, "type" | "options">;

export type APIApplicationCommandInteractionDataAutocompleteOption =
	| APIApplicationCommandInteractionDataStringOption
	| APIApplicationCommandInteractionDataIntegerOption
	| APIApplicationCommandInteractionDataNumberOption;

export type AutocompleteOptionTypes =
	| Autocomplete<ApplicationCommandOptionType.String>
	| Autocomplete<ApplicationCommandOptionType.Number>
	| Autocomplete<ApplicationCommandOptionType.Integer>;

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

export type Autocomplete<T extends ApplicationCommandOptionType> =
	APIApplicationCommandOptionBase<T> & {
		autocomplete: true;
	};

export default class Option
	implements Serializable, Comparable<APIApplicationCommandOption>
{
	public readonly type;
	public readonly name;
	public readonly description;
	public readonly required;
	public readonly options;

	constructor({
		type,
		name,
		description,
		options,
		required = false,
	}: OptionArgs) {
		this.type = type;
		this.name = name;
		this.description = description;
		this.required = required;
		this.options = options;
	}

	isAutocomplete(
		_payload?: APIApplicationCommandOption
	): _payload is AutocompleteOptionTypes {
		return false;
	}

	serialize(): APIApplicationCommandOption {
		// TypeScript and discord-api-types don't play well with our usage
		// of generic fields for the `type` field. We need to cast instead
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		const payload = {
			type: this.type,
			name: this.name,
			description: this.description,
			required: this.required,
		} as APIApplicationCommandBasicOption;

		// TODO: Handle Options (do we want to?)

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

		// TODO: Nothing uses options yet, but eventually verify they're correct somehow
		// if ((this.options?.length ?? 0) !== (schema.options?.length ?? 0)) {
		// 	return false;
		// }

		return true;
	}
}
