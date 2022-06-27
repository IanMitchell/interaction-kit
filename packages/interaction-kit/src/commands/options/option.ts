import { APIApplicationCommandOptionBase } from "discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/base";
import {
	APIApplicationCommandBasicOption,
	APIApplicationCommandInteractionDataBasicOption,
	APIApplicationCommandInteractionDataIntegerOption,
	APIApplicationCommandInteractionDataNumberOption,
	APIApplicationCommandInteractionDataOption,
	APIApplicationCommandInteractionDataStringOption,
	APIApplicationCommandOption,
	ApplicationCommandOptionType,
} from "discord-api-types/v10";
import { Comparable, Serializable } from "../../interfaces";

type OptionArgs = {
	type: ApplicationCommandOptionType;
	name: string;
	description: string;
};

export type BaseOptionArgs = Omit<OptionArgs, "type">;

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

export class Option
	implements
		Serializable<APIApplicationCommandOption>,
		Comparable<APIApplicationCommandOption>
{
	public readonly type;
	public readonly name;
	public readonly description;

	constructor({ type, name, description }: OptionArgs) {
		this.type = type;
		this.name = name;
		this.description = description;
	}

	isAutocomplete(
		_payload?: APIApplicationCommandOption
	): _payload is AutocompleteOptionTypes {
		return false;
	}

	serialize(): APIApplicationCommandOption {
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		return {
			type: this.type,
			name: this.name,
			description: this.description,
		} as APIApplicationCommandOption;
	}

	equals(schema: APIApplicationCommandOption): boolean {
		if (
			this.type !== schema.type ||
			this.name !== schema.name ||
			this.description !== schema.description
		) {
			return false;
		}

		return true;
	}
}

interface BasicOptionArgs extends OptionArgs {
	required: boolean | undefined;
}

export type BaseBasicOptionArgs = Omit<BasicOptionArgs, "type">;

export class BasicOption extends Option {
	public readonly required;

	constructor({ name, description, type, required }: BasicOptionArgs) {
		super({
			type,
			name,
			description,
		});
		this.required = required;
	}

	serialize(): APIApplicationCommandBasicOption {
		if (this.required === undefined) {
			return super.serialize() as APIApplicationCommandBasicOption;
		}

		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		return {
			...super.serialize(),
			required: this.required,
		} as APIApplicationCommandBasicOption;
	}

	equals(schema: APIApplicationCommandBasicOption): boolean {
		return super.equals(schema) && this.required === schema.required;
	}
}
