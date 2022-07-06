import {
	APIApplicationCommandUserOption,
	ApplicationCommandOptionType,
} from "discord-api-types/v10";
import { Optional } from "../../interfaces";
import { BaseBasicOptionArgs, BasicOption } from "./option";

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
