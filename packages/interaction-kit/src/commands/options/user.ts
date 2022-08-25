import type { APIApplicationCommandUserOption } from "discord-api-types/v10";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import type { Optional } from "../../interfaces.js";
import type { BaseBasicOptionArgs } from "./option.js";
import { BasicOption } from "./option.js";

export default class UserOption extends BasicOption<APIApplicationCommandUserOption> {
	constructor({
		name,
		description,
		required,
	}: Optional<BaseBasicOptionArgs, "required">) {
		super({
			type: ApplicationCommandOptionType.User,
			name,
			description,
			required,
		});
	}
}
