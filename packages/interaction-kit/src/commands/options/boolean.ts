import type { APIApplicationCommandBooleanOption } from "discord-api-types/v10";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import type { Optional } from "../../interfaces";
import type { BaseBasicOptionArgs } from "./option";
import { BasicOption } from "./option";

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
