import {
	APIApplicationCommandRoleOption,
	ApplicationCommandOptionType,
} from "discord-api-types/v10";
import { Optional } from "../../interfaces";
import { BaseBasicOptionArgs, BasicOption } from "./option";

export default class RoleOption extends BasicOption<APIApplicationCommandRoleOption> {
	constructor({
		name,
		description,
		required,
	}: Optional<BaseBasicOptionArgs, "required">) {
		super({
			type: ApplicationCommandOptionType.Role,
			name,
			description,
			required,
		});
	}
}
