import * as API from "../../api";
import Application from "../../application";
import {
	Interaction,
	InteractionMessageModifiers,
	InteractionReply,
	RequestBody,
	ResponseHandler,
	SerializableComponent,
	Snowflake,
} from "../../interfaces";
import { isActionRow } from "../../components/action-row";
import {
	APIMessageComponentInteraction,
	InteractionType,
} from "discord-api-types/payloads/v9";

export default class MessageComponentInteraction implements Interaction {
	public readonly type = InteractionType.MessageComponent;
	public readonly token: string;
	public readonly respond: ResponseHandler;
	public readonly customID: string;
	public readonly messages: InteractionMessageModifiers;
	readonly #application: Application;
	#replied: boolean;

	// TODO: Convert these into Records
	public readonly channelID: Snowflake | undefined;
	public readonly guildID: Snowflake | undefined;
	public readonly member: Record<string, unknown> | undefined;
	public readonly message: Record<string, unknown> | undefined;

	constructor(
		application: Application,
		json: RequestBody<APIMessageComponentInteraction>,
		respond: ResponseHandler
	) {
		this.#application = application;
		this.respond = respond;
		this.token = json.token;
		this.customID = json.data?.custom_id ?? "";

		// TODO: Make these records
		this.channelID = json.channel_id;
		this.guildID = json.guild_id;
		this.member = json.member;
		this.message = json.message;

		// TODO: Rename?
		this.messages = {
			edit: async (
				data: InteractionApplicationCommandCallbackData,
				id = "@original"
			) => API.patchInteractionFollowup(this.token, id, data),

			delete: async (id = "@original") =>
				API.deleteWebhookMessage(this.token, id),
		};

		this.#replied = false;
	}

	defer() {
		return this.response.status(200).send({
			type: InteractionCallbackType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
		});
	}

	async reply({
		message,
		embed,
		components,
		ephemeral = false,
		queue = false,
	}: InteractionReply) {
		const data: InteractionResponse["data"] = {};

		if (message != null) {
			data.content = message;
		}

		if (ephemeral) {
			data.flags = InteractionCallbackDataFlags.EPHEMERAL;
		}

		if (embed != null) {
			data.embeds = ([] as Embed[])
				.concat(embed)
				.map((item) => item.serialize());
		}

		if (components != null) {
			components.forEach((component: SerializableComponent) => {
				if (isActionRow(component)) {
					component.components.forEach((child) => {
						this.#application.addComponent(child);
					});
				} else {
					this.#application.addComponent(component);
				}
			});

			data.components = ([] as SerializableComponent[])
				.concat(components)
				.map((component) => component.serialize());
		}

		const payload: InteractionResponse = {
			type: InteractionCallbackType.CHANNEL_MESSAGE_WITH_SOURCE,
			data,
		};

		if (!this.#replied && !queue) {
			this.#replied = true;
			await this.response.status(200).send(payload);
			return "@original";
		}

		// TODO: Verified this sends the ID back (we probably need to extract it)
		const id = await API.postInteractionFollowup(this.token, data);

		return id;
	}
}
