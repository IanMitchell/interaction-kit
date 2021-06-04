import { ApplicationCommandOptionType } from "../definitions";

type InputArgs = {
	type: ApplicationCommandOptionType;
	name: string;
	description: string;
	required?: boolean;
};

export class Input {
	public readonly type;
	public readonly name;
	public readonly description;
	public readonly required;

	constructor({ type, name, description, required = false }: InputArgs) {
		this.type = type;
		this.name = name;
		this.description = description;
		this.required = required;
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
