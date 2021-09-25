import type { FastifyReply, FastifyRequest } from "fastify";
import {
	ApplicationCommandInteractionDataOption,
	Interaction as InteractionDefinition,
	InteractionApplicationCommandCallbackData,
	InteractionCallbackType,
	InteractionResponse,
	InteractionRequestType,
	OptionType,
	Snowflake,
	ApplicationCommandType,
} from "../definitions";
import { PermissionFlags } from "../definitions/messages";
import Embed from "../components/embed";
import * as API from "../api";
import Application from "../application";
import {
	Interaction,
	InteractionMessageModifiers,
	InteractionReply,
	SerializableComponent,
} from "../interfaces";
import { isActionRow } from "../components/action-row";

type MessageTargetType = {
	pinned: boolean;
};

type UserTargetType = {
	bot: boolean;
};

type TargetType<T extends ApplicationCommandType> =
	T extends ApplicationCommandType.CHAT_INPUT
		? null
		: T extends ApplicationCommandType.MESSAGE
		? MessageTargetType
		: T extends ApplicationCommandType.USER
		? UserTargetType
		: null;

export default class ApplicationCommandInteraction<
	T extends ApplicationCommandType
> implements Interaction
{
	public readonly type = InteractionRequestType.APPLICATION_COMMAND;
	public readonly commandType: T;
	public readonly name: string;
	public readonly token: string;
	public readonly target: TargetType<T>;

	public readonly response: FastifyReply;
	public readonly messages: InteractionMessageModifiers;

	// TODO: Convert these into Records
	public readonly channelID: Snowflake | undefined;
	public readonly guildID: Snowflake | undefined;
	public readonly member: Record<string, unknown> | undefined;

	readonly #options: Map<string, ApplicationCommandInteractionDataOption>;
	readonly #application: Application;
	#replied: boolean;

	constructor(
		application: Application,
		request: FastifyRequest<{ Body: InteractionDefinition }>,
		response: FastifyReply
	) {
		this.#application = application;
		this.response = response;
		this.token = request.body.token;
		this.name = request.body.data?.name?.toLowerCase() ?? "";
		this.#options = new Map();

		const id = request.body.data?.target_id ?? "0";
		switch (request.body.data?.type) {
			case ApplicationCommandType.MESSAGE:
				this.commandType = ApplicationCommandType.MESSAGE;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				this.target = request.body.data?.resolved?.messages?.[id] ?? {};
				break;
			case ApplicationCommandType.USER:
				this.commandType = ApplicationCommandType.USER;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				this.target = {
					...(request.body?.data?.resolved?.members?.[id] ?? {}),
					...(request.body?.data?.resolved?.users?.[id] ?? {}),
				};
				break;
			case ApplicationCommandType.CHAT_INPUT:
			default:
				// @ts-expect-error
				this.commandType = ApplicationCommandType.CHAT_INPUT;
				// @ts-expect-error
				this.target = null;
				break;
		}

		// TEMPORARY
		this.member = request.body?.member;

		request.body?.data?.options?.forEach((option) => {
			this.#options.set(option.name.toLowerCase(), option);
		});

		this.#replied = false;

		this.messages = {
			edit: async (
				data: InteractionApplicationCommandCallbackData,
				id = "@original"
			) => API.patchWebhookMessage(this.token, id, data),

			delete: async (id = "@original") =>
				API.deleteWebhookMessage(this.token, id),
		};
	}

	// TODO: Type? Should return an object where keys = #options keys, and value = ApplicationCommandInteractionDataOption
	get options() {
		return new Proxy(
			{},
			{
				get: (target, property): OptionType | null => {
					return this.#options.get(property.toString())?.value ?? null;
				},
			}
		);
	}

	// TODO: Is `defer` more appropriate?
	acknowledge() {
		return this.response.status(200).send({
			type: InteractionCallbackType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
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
