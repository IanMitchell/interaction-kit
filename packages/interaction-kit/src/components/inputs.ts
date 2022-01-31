import { Comparable, Serializable } from "../interfaces";
import {
	ApplicationCommandOption,
	ApplicationCommandOptionChoice,
	ApplicationCommandOptionType,
} from "../definitions";
import { SlashChoiceList } from "./choices";

type InputChoiceValue = ApplicationCommandOptionChoice["value"];

export interface InputKey
	extends Serializable<ApplicationCommandOption>,
		Comparable<ApplicationCommandOption> {
	readonly name: string;
}

type InputArgs<T extends string> = {
	type: ApplicationCommandOptionType;
	name: T;
	description: string;
	required?: boolean;
	choices?: SlashChoiceList<InputChoiceValue>;
	options?: ApplicationCommandOption[];
};

export class Input<Name extends string>
	implements
		Serializable<ApplicationCommandOption>,
		Comparable<ApplicationCommandOption>
{
	public readonly type;
	public readonly name: Name;
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
	}: InputArgs<Name>) {
		this.type = type;
		this.name = name;
		this.description = description;
		this.required = required;
		this.choices = choices;
		this.options = options;
	}

	serialize(): ApplicationCommandOption {
		const payload: ApplicationCommandOption = {
			type: this.type,
			name: this.name,
			description: this.description,
			required: this.required,
		};

		if (this.choices != null) {
			payload.choices = this.choices.serialize();
		}

		// TODO: Handle Options (do we want to?)

		return payload;
	}

	equals(schema: ApplicationCommandOption): boolean {
		if (
			this.type !== schema.type ||
			this.name !== schema.name ||
			this.description !== schema.description ||
			this.required !== (schema.required ?? false)
		) {
			return false;
		}

		if ((this.choices?._choices?.size ?? 0) !== (schema.choices?.length ?? 0)) {
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

		// TODO: Nothing uses options yet, but eventually verify they're correct somehow
		// if ((this.options?.length ?? 0) !== (schema.options?.length ?? 0)) {
		// 	return false;
		// }

		return true;
	}
}

interface StringInputArgs<Name extends string>
	extends Omit<InputArgs<Name>, "type" | "options"> {
	choices?: SlashChoiceList<string>;
}

export class StringInput<Name extends string> extends Input<Name> {
	constructor(args: StringInputArgs<Name>) {
		super({ type: ApplicationCommandOptionType.STRING, ...args });
	}
}

interface IntegerInputArgs<Name extends string>
	extends Omit<InputArgs<Name>, "type" | "options"> {
	choices?: SlashChoiceList<number>;
}

export class IntegerInput<Name extends string> extends Input<Name> {
	constructor(args: IntegerInputArgs<Name>) {
		super({ type: ApplicationCommandOptionType.INTEGER, ...args });
	}
}

interface NumberInputArgs<Name extends string>
	extends Omit<InputArgs<Name>, "type" | "options"> {
	choices?: SlashChoiceList<number>;
}

export class NumberInput<Name extends string> extends Input<Name> {
	constructor(args: NumberInputArgs<Name>) {
		super({ type: ApplicationCommandOptionType.NUMBER, ...args });
	}
}

export class BooleanInput<Name extends string> extends Input<Name> {
	constructor(args: Omit<InputArgs<Name>, "type" | "choices" | "options">) {
		super({ type: ApplicationCommandOptionType.BOOLEAN, ...args });
	}
}

export class UserInput<Name extends string> extends Input<Name> {
	constructor(args: Omit<InputArgs<Name>, "type" | "choices" | "options">) {
		super({ type: ApplicationCommandOptionType.USER, ...args });
	}
}

export class ChannelInput<Name extends string> extends Input<Name> {
	constructor(args: Omit<InputArgs<Name>, "type" | "choices" | "options">) {
		super({ type: ApplicationCommandOptionType.CHANNEL, ...args });
	}
}

export class RoleInput<Name extends string> extends Input<Name> {
	constructor(args: Omit<InputArgs<Name>, "type" | "choices" | "options">) {
		super({ type: ApplicationCommandOptionType.ROLE, ...args });
	}
}

export class MentionableInput<Name extends string> extends Input<Name> {
	constructor(args: Omit<InputArgs<Name>, "type" | "choices" | "options">) {
		super({ type: ApplicationCommandOptionType.MENTIONABLE, ...args });
	}
}
