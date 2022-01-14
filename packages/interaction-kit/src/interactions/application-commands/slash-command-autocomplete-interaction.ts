import type { FastifyReply, FastifyRequest } from "fastify";
import Application from "../../application";
import {
	ApplicationCommandInteractionDataOption,
	ApplicationCommandType,
	Interaction as InteractionDefinition,
	OptionType,
} from "../../definitions";
import { InteractionKitCommand } from "../../interfaces";
import ApplicationCommandInteraction from "./application-command-interaction";

export default class SlashCommandAutocompleteInteraction extends ApplicationCommandInteraction {
	readonly #options: Map<string, ApplicationCommandInteractionDataOption>;

	constructor(
		application: Application,
		command: InteractionKitCommand<SlashCommandAutocompleteInteraction>,
		request: FastifyRequest<{ Body: InteractionDefinition }>,
		response: FastifyReply
	) {
		super(application, request, response);
		this.#options = new Map();

		request.body?.data?.options?.forEach((option) => {
			this.#options.set(option.name.toLowerCase(), option);
		});
	}

	get commandType() {
		return ApplicationCommandType.CHAT_INPUT;
	}
}
