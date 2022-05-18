import {
	APIApplicationCommandOption,
	APIApplicationCommandSubcommandOption,
	ApplicationCommandOptionType,
} from "discord-api-types/v10";
import Option, { BaseOptionArgs } from "./option";

export default class Subcommand extends Option {
	public readonly type = ApplicationCommandOptionType.Subcommand;

	constructor({ name, description }: BaseOptionArgs) {
		super({
			type: ApplicationCommandOptionType.Subcommand,
			name,
			description,
		});
	}

	serialize(): APIApplicationCommandSubcommandOption {
		// TODO: Fix
		return super.serialize();
	}

	equals(schema: APIApplicationCommandOption): boolean {
		// TODO: Fix
		return super.equals(schema);
	}
}
