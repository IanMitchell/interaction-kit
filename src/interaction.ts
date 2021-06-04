import type { FastifyReply, FastifyRequest } from "fastify";
import {
	ApplicationCommandInteractionDataOption,
	Interaction as IInteraction,
	InteractionResponse,
	InteractionType,
} from "./definitions";
import { PermissionFlags } from "./data/messages";

export default class Interaction {
	public readonly type: InteractionType;
	public readonly name: string | undefined;
	public readonly response: FastifyReply;
	readonly #options: Map<string, ApplicationCommandInteractionDataOption>;

	constructor(
		request: FastifyRequest<{ Body: IInteraction }>,
		response: FastifyReply
	) {
		this.response = response;

		this.type = request.body.type;
		this.name = request.body.data?.name?.toLowerCase();

		this.#options = new Map();

		request.body?.data?.options?.forEach((option) => {
			this.#options.set(option.name.toLowerCase(), option);
		});
	}

	reply({
		message,
		ephemeral = false,
	}: {
		message: string;
		ephemeral: boolean;
	}) {
		const payload: InteractionResponse = {
			type: 4,
			data: { content: message },
		};

		if (ephemeral && payload.data) {
			payload.data.flags = PermissionFlags.EPHEMERAL;
		}

		return this.response.status(200).send(payload);
	}
}
