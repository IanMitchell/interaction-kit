import {
	createInteractionFollowup,
	deleteInteractionFollowup,
	editInteractionFollowup,
} from "discord-api-methods";
import type {
	APIApplicationCommandInteraction,
	APIInteractionGuildMember,
	APIInteractionResponse,
	RESTPatchAPIInteractionFollowupJSONBody,
} from "discord-api-types/v10";
import {
	InteractionResponseType,
	InteractionType,
	MessageFlags,
} from "discord-api-types/v10";
import type { Snowflake } from "discord-snowflake";
import type Application from "../../application.js";
import Config from "../../config.js";
import type {
	Interaction,
	InteractionMessageModifiers,
	InteractionReply,
	RequestBody,
	ResponseHandler,
} from "../../interfaces.js";
import { ResponseStatus } from "../../requests/response.js";
import type Embed from "../../structures/embed.js";

export default class ApplicationCommandInteraction implements Interaction {
	public readonly type = InteractionType.ApplicationCommand;
	public readonly name: string;
	public readonly token: string;

	public readonly messages: InteractionMessageModifiers;

	// TODO: Convert these into Records
	public readonly channelId: Snowflake | undefined;
	public readonly guildId: Snowflake | undefined;
	public readonly member: APIInteractionGuildMember | undefined;

	readonly #respond: ResponseHandler;
	readonly #application: Application;
	#replied: boolean;

	constructor(
		application: Application,
		json: RequestBody<APIApplicationCommandInteraction>,
		respond: ResponseHandler
	) {
		this.#application = application;
		this.#respond = respond;
		this.token = json.token;
		this.name = json.data.name ?? "";

		// TEMPORARY
		this.member = json.member;

		this.#replied = false;

		this.messages = {
			edit: async (
				data: RESTPatchAPIInteractionFollowupJSONBody,
				id = "@original"
			) =>
				editInteractionFollowup(
					Config.getApplicationId(),
					this.token,
					id,
					data
				),

			delete: async (id = "@original") =>
				deleteInteractionFollowup(Config.getApplicationId(), this.token, id),
		};
	}

	async defer() {
		return this.#respond(ResponseStatus.OK, {
			type: InteractionResponseType.DeferredChannelMessageWithSource,
		});
	}

	// TODO: This is mostly shared with message-component-interaction
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
			payload.data.components = components.map((component) => {
				// Register all child components while we're here
				component.components.forEach((child) => {
					this.#application.addComponent(child);
				});

				return component.serialize();
			});
		}

		if (!this.#replied && !queue) {
			this.#replied = true;
			await this.#respond(ResponseStatus.OK, payload);
			return "@original";
		}

		const responseData = await createInteractionFollowup(
			Config.getApplicationId(),
			this.token,
			payload.data
		);
		return responseData.id;
	}
}
