import { Serializable } from "../interfaces";
import {
	ApplicationCommandOption,
	ApplicationCommandOptionChoice,
	ApplicationCommandOptionType,
} from "../definitions";

type InputArgs = {
	type: ApplicationCommandOptionType;
	name: string;
	description: string;
	required?: boolean;
	choices?: ChoiceList<string | number>;
	options?: ApplicationCommandOption[];
};

export class Input implements Serializable {
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
}

interface StringInputArgs extends Omit<InputArgs, "type" | "options"> {
	choices: ChoiceList<string>;
}

export class StringInput extends Input {
	constructor(args: StringInputArgs) {
		super({ type: ApplicationCommandOptionType.STRING, ...args });
	}
}

interface IntegerInputArgs extends Omit<InputArgs, "type" | "options"> {
	choices: ChoiceList<number>;
}

export class IntegerInput extends Input {
	constructor(args: IntegerInputArgs) {
		super({ type: ApplicationCommandOptionType.INTEGER, ...args });
	}
}

export class BooleanInput extends Input {
	constructor(args: Omit<InputArgs, "type" | "choices" | "options">) {
		super({ type: ApplicationCommandOptionType.BOOLEAN, ...args });
	}
}

export class UserInput extends Input {
	constructor(args: Omit<InputArgs, "type" | "choices" | "options">) {
		super({ type: ApplicationCommandOptionType.USER, ...args });
	}
}

export class ChannelInput extends Input {
	constructor(args: Omit<InputArgs, "type" | "choices" | "options">) {
		super({ type: ApplicationCommandOptionType.CHANNEL, ...args });
	}
}

export class RoleInput extends Input {
	constructor(args: Omit<InputArgs, "type" | "choices" | "options">) {
		super({ type: ApplicationCommandOptionType.ROLE, ...args });
	}
}

export class MentionableInput extends Input {
	constructor(args: Omit<InputArgs, "type" | "choices" | "options">) {
		super({ type: ApplicationCommandOptionType.MENTIONABLE, ...args });
	}
}

export class ChoiceList<T extends string | number> implements Serializable {
	public readonly _choices: Map<string, T>;

	constructor(choices: Record<string, T>) {
		this._choices = new Map(Object.entries(choices));

		Object.keys(choices).forEach((key) =>
			Object.defineProperty(this, key, {
				writable: false,
				value: key,
			})
		);
	}

	static create<T extends string | number, U extends Record<string, T>>(
		this: typeof ChoiceList,
		choices: U
	) {
		return Object.freeze(new this(choices)) as ChoiceList<T> & U;
	}

	serialize(): ApplicationCommandOptionChoice[] {
		return Array.from(this._choices.entries()).map(([value, key]) => ({
			name: value,
			value: key,
		}));
	}
}
