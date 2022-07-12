import {
	APIApplicationCommandBooleanOption,
	ApplicationCommandOptionType,
} from "discord-api-types/v10";
import { Optional } from "../../interfaces";
import { BaseBasicOptionArgs, BasicOption } from "./option";

export default class BooleanOption extends BasicOption<APIApplicationCommandBooleanOption> {
	constructor({
		name,
		description,
		required,
	}: Optional<BaseBasicOptionArgs, "required">) {
		super({
			type: ApplicationCommandOptionType.Boolean,
			name,
			description,
			required,
		});
	}
}
