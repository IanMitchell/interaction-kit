import { ApplicationCommandOptionType } from "discord-api-types/v9";
import BaseOption, { BaseOptionArgs } from "./option";

export default class AttachmentOption extends BaseOption {
	constructor({ name, description, required }: BaseOptionArgs) {
		super({
			type: ApplicationCommandOptionType.Attachment,
			name,
			description,
			required,
		});
	}
}
