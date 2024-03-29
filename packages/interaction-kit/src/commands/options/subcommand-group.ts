import type { APIApplicationCommandSubcommandGroupOption } from "discord-api-types/v10";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import type { BaseOptionArgs } from "./option.js";
import { Option } from "./option.js";
import type Subcommand from "./subcommand.js";

type SubcommandGroupArgs = {
	subcommands: Subcommand[];
} & BaseOptionArgs;

export default class SubcommandGroup extends Option {
	public readonly type = ApplicationCommandOptionType.SubcommandGroup;
	public readonly subcommands: Map<string, Subcommand>;

	constructor({ name, description, subcommands }: SubcommandGroupArgs) {
		super({
			type: ApplicationCommandOptionType.SubcommandGroup,
			name,
			description,
		});

		this.subcommands = new Map(subcommands.map((cmd) => [cmd.name, cmd]));
	}

	serialize(): APIApplicationCommandSubcommandGroupOption {
		const payload =
			super.serialize() as APIApplicationCommandSubcommandGroupOption;

		payload.options = [...this.subcommands.values()].map((subcommand) =>
			subcommand.serialize()
		);

		return payload;
	}

	equals(schema: APIApplicationCommandSubcommandGroupOption) {
		if (this.subcommands.size !== schema.options?.length) {
			return false;
		}

		const serializedSubcommands = [...this.subcommands.values()].map(
			(subcommand) => subcommand.serialize()
		);

		if (serializedSubcommands !== schema.options) {
			return false;
		}

		return super.equals(schema);
	}
}
