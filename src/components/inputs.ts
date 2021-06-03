import { Serializable } from "../interfaces";
import {
	ApplicationCommandOption,
	ApplicationCommandOptionType,
} from "../api/api";

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
	public readonly choices;
	public readonly options;

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
		return {
			type: this.type,
			name: this.name,
			description: this.description,
			required: this.required,
			// TODO: Implement this
			// choices?: ApplicationCommandOptionChoice[];
			// options?: ApplicationCommandOption[];
		};
	}
}

export class StringInput extends Input {
	constructor(args: Omit<InputArgs, "type">) {
		super({ type: ApplicationCommandOptionType.STRING, ...args });
	}
}

export class IntegerInput extends Input {
	constructor(args: Omit<InputArgs, "type">) {
		super({ type: ApplicationCommandOptionType.INTEGER, ...args });
	}
}

export class BooleanInput extends Input {
	constructor(args: Omit<InputArgs, "type">) {
		super({ type: ApplicationCommandOptionType.BOOLEAN, ...args });
	}
}

export class UserInput extends Input {
	constructor(args: Omit<InputArgs, "type">) {
		super({ type: ApplicationCommandOptionType.USER, ...args });
	}
}

export class ChannelInput extends Input {
	constructor(args: Omit<InputArgs, "type">) {
		super({ type: ApplicationCommandOptionType.CHANNEL, ...args });
	}
}

export class RoleInput extends Input {
	constructor(args: Omit<InputArgs, "type">) {
		super({ type: ApplicationCommandOptionType.ROLE, ...args });
	}
}

export class MentionableInput extends Input {
	constructor(args: Omit<InputArgs, "type">) {
		super({ type: ApplicationCommandOptionType.MENTIONABLE, ...args });
	}
}
