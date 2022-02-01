import { Comparable, Serializable } from "../interfaces";
import {
	ApplicationCommandOption,
	ApplicationCommandOptionChoice,
	ApplicationCommandOptionType,
	ApplicationCommandOptionWithChoice,
} from "../definitions";
import { SlashChoiceList } from "./choices";

type InputChoiceValue = ApplicationCommandOptionChoice["value"];

export function isChoiceType(
	input: ApplicationCommandOption
): input is ApplicationCommandOptionWithChoice {
	switch (input.type) {
		case ApplicationCommandOptionType.STRING:
		case ApplicationCommandOptionType.INTEGER:
		case ApplicationCommandOptionType.NUMBER:
			return true;
		default:
			return false;
	}
}

export interface InputKey
	extends Serializable<ApplicationCommandOption>,
		Comparable<ApplicationCommandOption> {
	readonly name: string;
	readonly type: ApplicationCommandOptionType;
}

type InputArgs<T extends string, U extends ApplicationCommandOptionType> = {
	type: U;
	name: T;
	description: string;
	required?: boolean;
	choices?: SlashChoiceList<InputChoiceValue>;
	options?: ApplicationCommandOption[];
};

export class Input<
	Name extends string,
	OptionType extends ApplicationCommandOptionType
> implements
		Serializable<ApplicationCommandOption>,
		Comparable<ApplicationCommandOption>
{
	public readonly name: Name;
	public readonly type: OptionType;
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
	}: InputArgs<Name, OptionType>) {
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

		if (isChoiceType(payload)) {
			if (this.choices != null) {
				payload.choices = this.choices.serialize();
			}
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

interface StringInputArgs<
	Name extends string,
	OptionType extends ApplicationCommandOptionType
> extends Omit<InputArgs<Name, OptionType>, "type" | "options"> {
	choices?: SlashChoiceList<string>;
}

export class StringInput<Name extends string> extends Input<
	Name,
	ApplicationCommandOptionType.STRING
> {
	constructor(
		args: StringInputArgs<Name, ApplicationCommandOptionType.STRING>
	) {
		super({ type: ApplicationCommandOptionType.STRING, ...args });
	}
}

interface IntegerInputArgs<
	Name extends string,
	OptionType extends ApplicationCommandOptionType
> extends Omit<InputArgs<Name, OptionType>, "type" | "options"> {
	choices?: SlashChoiceList<number>;
}

export class IntegerInput<Name extends string> extends Input<
	Name,
	ApplicationCommandOptionType.INTEGER
> {
	constructor(
		args: IntegerInputArgs<Name, ApplicationCommandOptionType.INTEGER>
	) {
		super({ type: ApplicationCommandOptionType.INTEGER, ...args });
	}
}

interface NumberInputArgs<
	Name extends string,
	OptionType extends ApplicationCommandOptionType
> extends Omit<InputArgs<Name, OptionType>, "type" | "options"> {
	choices?: SlashChoiceList<number>;
}

export class NumberInput<Name extends string> extends Input<
	Name,
	ApplicationCommandOptionType.NUMBER
> {
	constructor(
		args: NumberInputArgs<Name, ApplicationCommandOptionType.NUMBER>
	) {
		super({ type: ApplicationCommandOptionType.NUMBER, ...args });
	}
}

export class BooleanInput<Name extends string> extends Input<
	Name,
	ApplicationCommandOptionType.BOOLEAN
> {
	constructor(
		args: Omit<
			InputArgs<Name, ApplicationCommandOptionType.BOOLEAN>,
			"type" | "choices" | "options"
		>
	) {
		super({ type: ApplicationCommandOptionType.BOOLEAN, ...args });
	}
}

export class UserInput<Name extends string> extends Input<
	Name,
	ApplicationCommandOptionType.USER
> {
	constructor(
		args: Omit<
			InputArgs<Name, ApplicationCommandOptionType.USER>,
			"type" | "choices" | "options"
		>
	) {
		super({ type: ApplicationCommandOptionType.USER, ...args });
	}
}

export class ChannelInput<Name extends string> extends Input<
	Name,
	ApplicationCommandOptionType.CHANNEL
> {
	constructor(
		args: Omit<
			InputArgs<Name, ApplicationCommandOptionType.CHANNEL>,
			"type" | "choices" | "options"
		>
	) {
		super({ type: ApplicationCommandOptionType.CHANNEL, ...args });
	}
}

export class RoleInput<Name extends string> extends Input<
	Name,
	ApplicationCommandOptionType.ROLE
> {
	constructor(
		args: Omit<
			InputArgs<Name, ApplicationCommandOptionType.ROLE>,
			"type" | "choices" | "options"
		>
	) {
		super({ type: ApplicationCommandOptionType.ROLE, ...args });
	}
}

export class MentionableInput<Name extends string> extends Input<
	Name,
	ApplicationCommandOptionType.MENTIONABLE
> {
	constructor(
		args: Omit<
			InputArgs<Name, ApplicationCommandOptionType.MENTIONABLE>,
			"type" | "choices" | "options"
		>
	) {
		super({ type: ApplicationCommandOptionType.MENTIONABLE, ...args });
	}
}
