import Subcommand from "./subcommand";
import {
	APIApplicationCommandSubcommandGroupOption,
	ApplicationCommandOptionType,
} from "discord-api-types/v10";
import Option, { BaseOptionArgs } from "./option";

type SubcommandGroupArgs = {
	subcommands: Subcommand[];
} & BaseOptionArgs;

export default class SubcommandGroup extends Option {
	public readonly type = ApplicationCommandOptionType.SubcommandGroup;
	public readonly subcommands: Subcommand[];

	constructor({ name, description, subcommands }: SubcommandGroupArgs) {
		super({
			type: ApplicationCommandOptionType.SubcommandGroup,
			name,
			description,
		});

		this.subcommands = subcommands ?? [];
	}

	serialize(): APIApplicationCommandSubcommandGroupOption {
		const payload =
			super.serialize() as APIApplicationCommandSubcommandGroupOption;

		payload.options = this.subcommands.map((subcommand) =>
			subcommand.serialize()
		);

		return payload;
	}

	equals(schema: APIApplicationCommandSubcommandGroupOption) {
		if (this.subcommands.length !== schema.options?.length) {
			return false;
		}

		const serializedSubcommands = this.subcommands.map((subcommand) =>
			subcommand.serialize()
		);

		if (serializedSubcommands !== schema.options) {
			return false;
		}

		return super.equals(schema);
	}
}
