import type { FastifyReply, FastifyRequest } from "fastify";
import {
	ApplicationCommandInteractionDataOption,
	Interaction as InteractionDefinition,
	InteractionApplicationCommandCallbackData,
	InteractionCallbackType,
	InteractionResponse,
	InteractionRequestType,
	OptionType,
} from "./definitions";
import { PermissionFlags } from "./definitions/messages";
import Embed from "./components/embed";
import * as API from "./api";
import Application from "./application";
import { SerializableComponent } from "./interfaces";

type InteractionReply = {
	message?: string;
	embed?: Embed | Embed[] | null;
	components?: SerializableComponent | SerializableComponent[] | null;
	ephemeral?: boolean;
	queue?: boolean;
};

type InteractionMessageModifiers = {
	edit: (
		data: InteractionApplicationCommandCallbackData,
		id?: string
	) => ReturnType<typeof API.patchWebhookMessage>;
	delete: (id?: string) => ReturnType<typeof API.deleteWebhookMessage>;
};

export default class Interaction {
	public readonly type: InteractionRequestType;
	public readonly name: string | undefined;
	public readonly token: string;
	public readonly response: FastifyReply;
	public readonly messages: InteractionMessageModifiers;
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

		this.type = request.body.type;
		this.token = request.body.token;
		this.name = request.body.data?.name?.toLowerCase();

		this.#options = new Map();

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
			data.components = ([] as SerializableComponent[])
				.concat(components)
				.map((component) => component.serialize());

			// TODO: Add components to the Application
			// TODO: Figure out how to add things outside of this path...
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
