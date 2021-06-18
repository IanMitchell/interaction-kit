import type { FastifyReply, FastifyRequest } from "fastify";
import {
	ApplicationCommandInteractionDataOption,
	Interaction as IInteraction,
	InteractionApplicationCommandCallbackData,
	InteractionCallbackType,
	InteractionResponse,
	InteractionType,
	OptionType,
} from "./definitions";
import { PermissionFlags } from "./definitions/messages";
import Embed from "./components/embed";
import * as API from "./api/index";

type InteractionReply = {
	message?: string;
	embed?: Embed | Embed[] | null;
	ephemeral?: boolean;
	immediateFollowUp?: boolean;
};

// TODO: Set return types (should be returned data, likely)
type InteractionMessageModifiers = {
	edit: (
		data: InteractionApplicationCommandCallbackData,
		id?: string
	) => unknown;
	delete: (id?: string) => unknown;
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

		this.messages = {
			edit: (
				data: InteractionApplicationCommandCallbackData,
				id = "@original"
			) => {
				API.patchWebhookMessage({
					applicationID: process.env.applicationID,
					interactionToken: this.token,
					id,
					data,
				});
			},

			delete: (id = "@original") => {
				API.deleteWebhookMessage({
					applicationID: process.env.applicationID,
					interactionToken: this.token,
					id,
				});
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
			type: InteractionCallbackType.CHANNEL_MESSAGE_WITH_SOURCE,
			data,
		};

		if (!this.#replied && !immediateFollowUp) {
			this.#replied = true;
			await this.response.status(200).send(payload);
			return "@original";
		}

		// TODO: Verified this sends the ID back (we probably need to extract it)
		const id = await API.postWebhookMessage({
			applicationID: process.env.applicationID,
			interactionToken: this.token,
			data,
		});

		return id;
	}
}
