import type { FastifyReply, FastifyRequest } from "fastify";
import * as API from "../api";
import {
	ComponentType,
	Interaction as InteractionDefinition,
	InteractionApplicationCommandCallbackData,
	InteractionCallbackType,
	InteractionRequestType,
	InteractionResponse,
	SelectOption,
	Snowflake,
} from "../definitions";
import Application from "../application";
import {
	Interaction,
	InteractionMessageModifiers,
	InteractionReply,
	SerializableComponent,
} from "../interfaces";
import { PermissionFlags } from "../definitions/messages";
import Embed from "../components/embed";
import { isActionRow } from "../components/action-row";
import Select from "../components/select";

export default class MessageComponentInteraction implements Interaction {
	public readonly type = InteractionRequestType.MESSAGE_COMPONENT;
	public readonly token: string;
	public readonly response: FastifyReply;
	public readonly customID: string;
	public readonly messages: InteractionMessageModifiers;
	public readonly values: Set<SelectOption>;
	readonly #application: Application;
	#replied: boolean;

	// TODO: Convert these into Records
	public readonly channelID: Snowflake | undefined;
	public readonly guildID: Snowflake | undefined;
	public readonly member: Record<string, unknown> | undefined;
	public readonly message: Record<string, unknown> | undefined;

	constructor(
		application: Application,
		request: FastifyRequest<{ Body: InteractionDefinition }>,
		response: FastifyReply
	) {
		this.#application = application;
		this.response = response;
		this.token = request.body.token;
		this.customID = request?.body?.data?.custom_id ?? "";

		// TODO: This needs to be cleaned up
		let options: SelectOption[] = [];
		if (request?.body?.data?.component_type === ComponentType.SELECT) {
			options =
				request?.body?.data?.values?.map((value) => {
					const selectOption: SelectOption = { label: value, value };
					const component = application.getComponent(this.customID);

					if (component?.type === ComponentType.SELECT) {
						return (
							(component as Select).options._choices.get(value) ?? selectOption
						);
					}

					return selectOption;
				}) ?? [];
		}

		this.values = new Set<SelectOption>(options);

		// TODO: Make these records
		this.channelID = request.body.channel_id;
		this.guildID = request.body.guild_id;
		this.member = request.body.member;
		this.message = request.body.message;

		// TODO: Rename?
		this.messages = {
			edit: async (
				data: InteractionApplicationCommandCallbackData,
				id = "@original"
			) => API.patchWebhookMessage(this.token, id, data),

			delete: async (id = "@original") =>
				API.deleteWebhookMessage(this.token, id),
		};

		this.#replied = false;
	}

	// // TODO: Type? Should return an object where keys = #options keys, and value = ApplicationCommandInteractionDataOption
	// get options() {
	// 	return new Proxy(
	// 		{},
	// 		{
	// 			get: (target, property): OptionType | null => {
	// 				return this.#options.get(property.toString())?.value ?? null;
	// 			},
	// 		}
	// 	);
	// }

	// // TODO: Is `defer` more appropriate?
	acknowledge() {
		return this.response.status(200).send({
			type: InteractionCallbackType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
		});
	}

	// TODO: Should "reply" just be message content, and should "send" be the full object?
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
			data.flags = PermissionFlags.EPHEMERAL;
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
		const id = await API.postWebhookMessage(this.token, data);

		return id;
	}
}
