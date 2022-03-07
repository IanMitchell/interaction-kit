import { ApplicationCommandOptionType } from "discord-api-types/v9";
import BaseOption, { BaseOptionArgs } from "./option";

export default class UserOption extends BaseOption {
	constructor({ name, description, required }: BaseOptionArgs) {
		super({
			type: ApplicationCommandOptionType.User,
			name,
			description,
			required,
		});
	}
}
