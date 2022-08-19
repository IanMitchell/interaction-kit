import type { APIApplicationCommandChannelOption } from "discord-api-types/v10";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { isEqual } from "../../helpers/arrays.js";
import type { Optional } from "../../interfaces.js";
import type { BaseBasicOptionArgs } from "./option.js";
import { BasicOption } from "./option.js";

type ChannelOptionArgs = {
	channelTypes?:
		| APIApplicationCommandChannelOption["channel_types"]
		| undefined;
} & Optional<BaseBasicOptionArgs, "required">;

export default class ChannelOption extends BasicOption<APIApplicationCommandChannelOption> {
	public readonly channelTypes:
		| APIApplicationCommandChannelOption["channel_types"]
		| undefined;

	constructor({
		name,
		description,
		required,
		channelTypes,
	}: ChannelOptionArgs) {
		super({
			type: ApplicationCommandOptionType.Channel,
			name,
			description,
			required,
		});

		this.channelTypes = channelTypes;
	}

	serialize() {
		const payload = super.serialize();

		if (this.channelTypes != null) {
			payload.channel_types = this.channelTypes;
		}

		return payload;
	}

	equals(schema: APIApplicationCommandChannelOption) {
		return (
			super.equals(schema) && isEqual(this.channelTypes, schema.channel_types)
		);
	}
}
