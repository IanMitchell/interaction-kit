import type { APIApplicationCommandAttachmentOption } from "discord-api-types/v10";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import type { Optional } from "../../interfaces.js";
import type { BaseBasicOptionArgs } from "./option.js";
import { BasicOption } from "./option.js";

export default class AttachmentOption extends BasicOption<APIApplicationCommandAttachmentOption> {
	constructor({
		name,
		description,
		required,
	}: Optional<BaseBasicOptionArgs, "required">) {
		super({
			type: ApplicationCommandOptionType.Attachment,
			name,
			description,
			required,
		});
	}
}
