import { ApplicationCommandOptionType } from "discord-api-types/v10";
import Option, { BaseOptionArgs } from "./option";

export default class UserOption extends Option {
	constructor({ name, description, required }: BaseOptionArgs) {
		super({
			type: ApplicationCommandOptionType.User,
			name,
			description,
			required,
		});
	}
}
