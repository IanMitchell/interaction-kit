import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { Optional } from "../../interfaces";
import { BaseBasicOptionArgs, BasicOption } from "./option";

export default class MentionableOption extends BasicOption {
	constructor({
		name,
		description,
		required,
	}: Optional<BaseBasicOptionArgs, "required">) {
		super({
			type: ApplicationCommandOptionType.Mentionable,
			name,
			description,
			required,
		});
	}
}
