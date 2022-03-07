import { ApplicationCommandOptionType } from "discord-api-types/v9";
import BaseOption, { BaseOptionArgs } from "./option";

export default class BooleanOption extends BaseOption {
	constructor({ name, description, required }: BaseOptionArgs) {
		super({
			type: ApplicationCommandOptionType.Boolean,
			name,
			description,
			required,
		});
	}
}
