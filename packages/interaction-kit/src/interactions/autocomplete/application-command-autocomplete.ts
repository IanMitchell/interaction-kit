import type { FastifyReply, FastifyRequest } from "fastify";
import Application from "../../application";
import SlashCommand from "../../commands/slash-command";
import { InputKey } from "../../components/inputs";
import {
	Interaction as InteractionDefinition,
	InteractionCallbackType,
} from "../../definitions";
import AutocompleteInteraction from "./autocomplete-interaction";
import { SlashCommandAutocompleteType } from "./types";

export default class SlashCommandAutocompleteInteraction<
	V extends InputKey,
	T extends readonly [V, ...V[]] | []
> extends AutocompleteInteraction<T, SlashCommandAutocompleteType> {
	public readonly command: SlashCommand<V, T>;

	constructor(
		application: Application,
		command: SlashCommand<V, T>,
		request: FastifyRequest<{ Body: InteractionDefinition }>,
		response: FastifyReply
	) {
		super(
			application,
			request,
			response,
			InteractionCallbackType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT
		);

		this.command = command;
	}
}
