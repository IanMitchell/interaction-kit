import { ApplicationCommandOptionType } from "discord-api-types/v9";
import BaseOption, { BaseOptionArgs } from "./option";

export default class MentionableOption extends BaseOption {
	constructor({ name, description, required }: BaseOptionArgs) {
		super({
			type: ApplicationCommandOptionType.Mentionable,
			name,
			description,
			required,
		});
	}
}
