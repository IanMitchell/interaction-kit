import type { FastifyReply, FastifyRequest } from "fastify";
import Application from "../../application";
import {
	ApplicationCommandInteractionDataOption,
	ApplicationCommandInteractionDataOptionValueType,
	ApplicationCommandOptionType,
	ApplicationCommandType,
	Interaction as InteractionDefinition,
} from "../../definitions";
import { InteractionKitCommand } from "../../interfaces";
import ApplicationCommandInteraction from "./application-command-interaction";

export default class SlashCommandInteraction extends ApplicationCommandInteraction {
	readonly #options: Map<string, ApplicationCommandInteractionDataOption>;

	constructor(
		application: Application,
		command: InteractionKitCommand<SlashCommandInteraction>,
		request: FastifyRequest<{ Body: InteractionDefinition }>,
		response: FastifyReply
	) {
		super(application, request, response);
		this.#options = new Map();

		request.body?.data?.options?.forEach((option: ApplicationCommandInteractionDataOption) => {
			this.#options.set(option.name.toLowerCase(), option);
		});
	}

	get commandType() {
		return ApplicationCommandType.CHAT_INPUT;
	}

	// TODO: Type? Should return an object where keys = #options keys, and value = ApplicationCommandInteractionDataOption
	get options() {
		return new Proxy(
			{},
			{
				get: (target, property): ApplicationCommandInteractionDataOptionValueType | null =>
					this.#options.get(property.toString())?.value ?? null,
			}
		) as Record<string, ApplicationCommandInteractionDataOptionValueType>;
	}
}
