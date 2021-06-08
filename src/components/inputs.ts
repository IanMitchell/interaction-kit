import { Serializable } from "../interfaces";
import {
	ApplicationCommandOption,
	ApplicationCommandOptionChoice,
	ApplicationCommandOptionType,
} from "../definitions";

type ChoiceValue = ApplicationCommandOptionChoice["value"];

type InputArgs = {
	type: ApplicationCommandOptionType;
	name: string;
	description: string;
	required?: boolean;
	choices?: Choices<ChoiceValue>;
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
	choices: Choices<string>;
}

export class StringInput extends Input {
	constructor(args: StringInputArgs) {
		super({ type: ApplicationCommandOptionType.STRING, ...args });
	}
}

interface IntegerInputArgs extends Omit<InputArgs, "type" | "options"> {
	choices: Choices<number>;
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

type ExplicitChoice<T extends ChoiceValue> = {
	name: string;
	value: T;
};

export class Choices<T extends ChoiceValue> implements Serializable {
	public readonly _choices: Map<string, ApplicationCommandOptionChoice>;

	constructor(choices: Record<string, T | ExplicitChoice<T>>) {
		this._choices = new Map();

		Object.entries(choices).forEach(([key, value]) => {
			if (typeof value === "string") {
				this._choices.set(key, { name: value, value });
				Object.defineProperty(this, key, {
					writable: false,
					value,
				});
			} else if (typeof value === "number") {
				this._choices.set(key, { name: value.toString(), value });
				Object.defineProperty(this, key, {
					writable: false,
					value,
				});
			} else if (value instanceof Object) {
				this._choices.set(key, value);
				Object.defineProperty(this, key, {
					writable: false,
					value: value.value,
				});
			} else {
				throw new Error("Unknown Input Format");
			}
		});
	}

	static list<
		T extends ChoiceValue,
		U extends Record<string, T | ExplicitChoice<T>>
	>(this: typeof Choices, choices: U) {
		return Object.freeze(new this(choices)) as Choices<T> & U;
	}

	serialize(): ApplicationCommandOptionChoice[] {
		return Array.from(this._choices.values());
	}
}
