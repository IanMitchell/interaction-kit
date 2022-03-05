import {
	APIApplicationCommandBasicOption,
	APIApplicationCommandOption,
	APIApplicationCommandOptionChoice,
	ApplicationCommandOptionType,
} from "discord-api-types/payloads/v9";
import { Comparable, Serializable } from "../interfaces";
import { SlashChoiceList } from "./choices";

type InputChoiceValue = string | number;

type InputArgs = {
	type: ApplicationCommandOptionType;
	name: string;
	description: string;
	required?: boolean;
	choices?: SlashChoiceList<InputChoiceValue>;
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

export class Input
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
	}: InputArgs) {
		this.type = type;
		this.name = name;
		this.description = description;
		this.required = required;
		this.choices = choices;
		this.options = options;
	}

	serialize(): APIApplicationCommandOption {
		const payload: APIApplicationCommandOption = {
			type: this.type,
			name: this.name,
			description: this.description,
			required: this.required,
		};

		if (isChoiceType(payload)) {
			if (this.choices != null) {
				payload.choices = this.choices.serialize();
			}
		}

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

		if (isChoiceType(schema)) {
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
				schema.choices?.every((choice) => {
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

interface StringInputArgs extends Omit<InputArgs, "type" | "options"> {
	choices?: SlashChoiceList<string>;
}

export class StringInput extends Input {
	constructor(args: StringInputArgs) {
		super({ type: ApplicationCommandOptionType.String, ...args });
	}
}

interface IntegerInputArgs extends Omit<InputArgs, "type" | "options"> {
	choices?: SlashChoiceList<number>;
}

export class IntegerInput extends Input {
	constructor(args: IntegerInputArgs) {
		super({ type: ApplicationCommandOptionType.Integer, ...args });
	}
}

interface NumberInputArgs extends Omit<InputArgs, "type" | "options"> {
	choices?: SlashChoiceList<number>;
}

export class NumberInput extends Input {
	constructor(args: NumberInputArgs) {
		super({ type: ApplicationCommandOptionType.Number, ...args });
	}
}

export class BooleanInput extends Input {
	constructor(args: Omit<InputArgs, "type" | "choices" | "options">) {
		super({ type: ApplicationCommandOptionType.Boolean, ...args });
	}
}

export class UserInput extends Input {
	constructor(args: Omit<InputArgs, "type" | "choices" | "options">) {
		super({ type: ApplicationCommandOptionType.User, ...args });
	}
}

export class ChannelInput extends Input {
	constructor(args: Omit<InputArgs, "type" | "choices" | "options">) {
		super({ type: ApplicationCommandOptionType.Channel, ...args });
	}
}

export class RoleInput extends Input {
	constructor(args: Omit<InputArgs, "type" | "choices" | "options">) {
		super({ type: ApplicationCommandOptionType.Role, ...args });
	}
}

export class MentionableInput extends Input {
	constructor(args: Omit<InputArgs, "type" | "choices" | "options">) {
		super({ type: ApplicationCommandOptionType.Mentionable, ...args });
	}
}

export class AttachmentInput extends Input {
	constructor(args: Omit<InputArgs, "type" | "choices" | "options">) {
		super({ type: ApplicationCommandOptionType.Attachment, ...args });
	}
}
