import { ApplicationCommandOptionType } from "discord-api-types/v9";
import Option, { BaseOptionArgs } from "./option";

export default class BooleanOption extends Option {
	constructor({ name, description, required }: BaseOptionArgs) {
		super({
			type: ApplicationCommandOptionType.Boolean,
			name,
			description,
			required,
		});
	}
}
