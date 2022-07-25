import {
	deleteInteractionFollowup,
	patchInteractionFollowup,
	postInteractionFollowup,
} from "discord-api";
import type {
	APIInteractionGuildMember,
	APIInteractionResponse,
	APIMessage,
	APIMessageComponentInteraction,
	RESTPatchAPIInteractionFollowupJSONBody,
} from "discord-api-types/v10";
import {
	InteractionResponseType,
	InteractionType,
	MessageFlags,
} from "discord-api-types/v10";
import type { Snowflake } from "discord-snowflake";
import type Application from "../../application";
import { isActionRow } from "../../components/action-row";
import Config from "../../config";
import type {
	Interaction,
	InteractionMessageModifiers,
	InteractionReply,
	RequestBody,
	ResponseHandler,
	SerializableComponent,
} from "../../interfaces";
import { ResponseStatus } from "../../requests/response";
import type Embed from "../../structures/embed";

export default class MessageComponentInteraction implements Interaction {
	public readonly type = InteractionType.MessageComponent;
	public readonly token: string;
	public readonly customId: string;
	public readonly messages: InteractionMessageModifiers;
	readonly #application: Application;
	readonly #respond: ResponseHandler;
	#replied: boolean;

	// TODO: Convert these into Records
	public readonly channelId: Snowflake | undefined;
	public readonly guildId: Snowflake | undefined;
	public readonly member: APIInteractionGuildMember | undefined;
	public readonly message: APIMessage | undefined;

	constructor(
		application: Application,
		json: RequestBody<APIMessageComponentInteraction>,
		respond: ResponseHandler
	) {
		this.#application = application;
		this.#respond = respond;
		this.token = json.token;
		this.customId = json.data?.custom_id ?? "";

		// TODO: Make these records
		this.channelId = json.channel_id as Snowflake;
		this.guildId = json.guild_id as Snowflake;
		this.member = json.member;
		this.message = json.message;

		// TODO: Rename?
		this.messages = {
			edit: async (
				data: RESTPatchAPIInteractionFollowupJSONBody,
				id = "@original"
			) =>
				patchInteractionFollowup(
					Config.getApplicationId(),
					this.token,
					id,
					data
				),

			delete: async (id = "@original") =>
				deleteInteractionFollowup(Config.getApplicationId(), this.token, id),
		};

		this.#replied = false;
	}

	async defer() {
		return this.#respond(ResponseStatus.OK, {
			type: InteractionResponseType.DeferredChannelMessageWithSource,
		});
	}

	async reply({
		message,
		embed,
		components,
		ephemeral = false,
		queue = false,
	}: InteractionReply) {
		const payload: APIInteractionResponse = {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {},
		};

		if (message != null) {
			payload.data.content = message;
		}

		if (ephemeral) {
			payload.data.flags = MessageFlags.Ephemeral;
		}

		if (embed != null) {
			payload.data.embeds = ([] as Embed[])
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

			payload.data.components = components?.map((component) =>
				component.serialize()
			);
		}

		if (!this.#replied && !queue) {
			this.#replied = true;
			await this.#respond(ResponseStatus.OK, payload);
			return "@original";
		}

		const responseData = await postInteractionFollowup(
			Config.getApplicationId(),
			this.token,
			payload.data
		);
		return responseData.id;
	}
}
