import type { FastifyReply, FastifyRequest } from "fastify";
import {
	ApplicationCommandInteractionDataOption,
	Interaction as IInteraction,
	InteractionCallbackType,
	InteractionResponse,
	InteractionType,
	OptionType,
} from "./definitions";
import { PermissionFlags } from "./definitions/messages";
import Embed from "./components/embed";

type InteractionReply = {
	message?: string;
	embed?: Embed | Embed[] | null;
	ephemeral?: boolean;
	immediateFollowUp?: boolean;
};

type InteractionMessageModifiers = {
	// TODO: Type these better
	edit: (id) => unknown;
	delete: (id) => unknown;
};

export default class Interaction {
	public readonly type: InteractionType;
	public readonly name: string | undefined;
	public readonly token: string;
	public readonly response: FastifyReply;
	public readonly messages: InteractionMessageModifiers;
	readonly #options: Map<string, ApplicationCommandInteractionDataOption>;
	#replied: boolean;

	constructor(
		request: FastifyRequest<{ Body: IInteraction }>,
		response: FastifyReply
	) {
		this.response = response;

		this.type = request.body.type;
		this.token = request.body.token;
		this.name = request.body.data?.name?.toLowerCase();

		this.#options = new Map();

		request.body?.data?.options?.forEach((option) => {
			this.#options.set(option.name.toLowerCase(), option);
		});

		this.#replied = false;

		// TODO: Update and Remove, or Edit and Delete?
		this.messages = {
			edit: () => {
				API.patchWebhookMessage();
			},

			delete: () => {
				API.deleteWebhookMessage();
			},
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

	acknowledge() {
		return this.response.status(200).send({
			type: InteractionCallbackType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
		});
	}

	async reply({
		message,
		embed,
		ephemeral = false,
		immediateFollowUp = false,
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

		const payload: InteractionResponse = {
			type: 4,
			data,
		};

		if (!this.#replied && !immediateFollowUp) {
			this.#replied = true;
			await this.response.status(200).send(payload);
			return "@original";
		}

		const id = await API.postWebhookMessage();
		return id;
	}
}
