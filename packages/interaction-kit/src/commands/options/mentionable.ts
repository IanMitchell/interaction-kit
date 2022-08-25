import type { APIApplicationCommandMentionableOption } from "discord-api-types/v10";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import type { Optional } from "../../interfaces.js";
import type { BaseBasicOptionArgs } from "./option.js";
import { BasicOption } from "./option.js";

export default class MentionableOption extends BasicOption<APIApplicationCommandMentionableOption> {
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
