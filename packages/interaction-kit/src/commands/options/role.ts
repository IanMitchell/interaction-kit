import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { Optional } from "../../interfaces";
import Option, { BaseOptionArgs } from "./option";

export default class RoleOption extends Option {
	constructor({
		name,
		description,
		required,
	}: Optional<BaseOptionArgs, "required">) {
		super({
			type: ApplicationCommandOptionType.Role,
			name,
			description,
			required,
		});
	}
}
