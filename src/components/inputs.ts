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
	choices?: ApplicationCommandOptionChoice[];
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
			payload.choices = this.choices.map((choice) => ({
				name: choice.name,
				value: choice.value,
			}));
		}

		// TODO: Handle Options (do we want to?)

		return payload;
	}
}

export class StringInput extends Input {
	constructor(args: Omit<InputArgs, "type" | "options">) {
		super({ type: ApplicationCommandOptionType.STRING, ...args });
	}
}

export class IntegerInput extends Input {
	constructor(args: Omit<InputArgs, "type" | "options">) {
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
