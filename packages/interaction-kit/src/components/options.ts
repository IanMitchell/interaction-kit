import {
	APIApplicationCommandBasicOption,
	APIApplicationCommandOption,
	APIApplicationCommandOptionChoice,
	ApplicationCommandOptionType,
} from "discord-api-types/payloads/v9";
import { Comparable, Serializable } from "../interfaces";
import { SlashChoiceList } from "./choices";

type OptionChoiceValue = string | number;

type OptionArgs = {
	type: ApplicationCommandOptionType;
	name: string;
	description: string;
	required?: boolean;
	choices?: SlashChoiceList<OptionChoiceValue>;
	options?: APIApplicationCommandOption[];
};

export function isChoiceType(
	input: APIApplicationCommandBasicOption
): input is APIApplicationCommandOptionChoice {
	switch (input.type) {
		case ApplicationCommandOptionType.String:
		case ApplicationCommandOptionType.Integer:
		case ApplicationCommandOptionType.Number:
			return true;
		default:
			return false;
	}
}

export class Option
	implements Serializable, Comparable<APIApplicationCommandOption>
{
	public readonly type;
	public readonly name;
	public readonly description;
	public readonly required;
	public readonly options;
	public readonly choices;

	constructor({
		type,
		name,
		description,
		choices,
		options,
		required = false,
	}: OptionArgs) {
		this.type = type;
		this.name = name;
		this.description = description;
		this.required = required;
		this.choices = choices;
		this.options = options;
	}

	serialize(): APIApplicationCommandOption {
		// TypeScript and discord-api-types don't play well with our usage
		// of generic fields for the `type` field. We need to cast instead
		const payload = {
			type: this.type,
			name: this.name,
			description: this.description,
			required: this.required,
		} as APIApplicationCommandOption;

		// if (isChoiceType(payload)) {
		// 	if (this.choices != null) {
		// 		payload.choices = this.choices.serialize();
		// 	}
		// }

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

		// TODO: Typeguard instead of this
		if ("choices" in schema && schema.choices !== undefined) {
			if (
				(this.choices?._choices?.size ?? 0) !== (schema.choices?.length ?? 0)
			) {
				return false;
			}

			const choiceMap = new Map();
			for (const commandOption of this.choices?._choices?.values() ?? []) {
				choiceMap.set(commandOption.name, commandOption.value);
			}

			const choiceEquality =
				schema.choices
					.filter((choice) => choice.autocomplete === false);
					?.every((choice) => {
						if (!choiceMap.has(choice.name)) {
							return false;
						}

						return choiceMap.get(choice.name) === choice.value;
					}) ?? true;

			if (!choiceEquality) {
				return false;
			}
		}

		// TODO: Nothing uses options yet, but eventually verify they're correct somehow
		// if ((this.options?.length ?? 0) !== (schema.options?.length ?? 0)) {
		// 	return false;
		// }

		return true;
	}
}

interface StringOptionArgs extends Omit<OptionArgs, "type" | "options"> {
	choices?: SlashChoiceList<string>;
}

export class StringOption extends Option {
	constructor(args: StringOptionArgs) {
		super({ type: ApplicationCommandOptionType.String, ...args });
	}
}

interface IntegerOptionArgs extends Omit<OptionArgs, "type" | "options"> {
	choices?: SlashChoiceList<number>;
}

export class IntegerOption extends Option {
	constructor(args: IntegerOptionArgs) {
		super({ type: ApplicationCommandOptionType.Integer, ...args });
	}
}

interface NumberOptionArgs extends Omit<OptionArgs, "type" | "options"> {
	choices?: SlashChoiceList<number>;
}

export class NumberOption extends Option {
	constructor(args: NumberOptionArgs) {
		super({ type: ApplicationCommandOptionType.Number, ...args });
	}
}

export class BooleanOption extends Option {
	constructor(args: Omit<OptionArgs, "type" | "choices" | "options">) {
		super({ type: ApplicationCommandOptionType.Boolean, ...args });
	}
}

export class UserOption extends Option {
	constructor(args: Omit<OptionArgs, "type" | "choices" | "options">) {
		super({ type: ApplicationCommandOptionType.User, ...args });
	}
}

export class ChannelOption extends Option {
	constructor(args: Omit<OptionArgs, "type" | "choices" | "options">) {
		super({ type: ApplicationCommandOptionType.Channel, ...args });
	}
}

export class RoleOption extends Option {
	constructor(args: Omit<OptionArgs, "type" | "choices" | "options">) {
		super({ type: ApplicationCommandOptionType.Role, ...args });
	}
}

export class MentionableOption extends Option {
	constructor(args: Omit<OptionArgs, "type" | "choices" | "options">) {
		super({ type: ApplicationCommandOptionType.Mentionable, ...args });
	}
}

export class AttachmentOption extends Option {
	constructor(args: Omit<OptionArgs, "type" | "choices" | "options">) {
		super({ type: ApplicationCommandOptionType.Attachment, ...args });
	}
}
