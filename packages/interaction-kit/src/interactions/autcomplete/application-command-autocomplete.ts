import type { FastifyReply, FastifyRequest } from "fastify";
import SlashCommand from "../../commands/slash-command";
import Application from "../../application";
import {
	Interaction as InteractionDefinition,
	InteractionCallbackType,
} from "../../definitions";
import AutocompleteInteraction from "./autocomplete-interaction";
import { SlashCommandAutocompleteType } from "./types";

export default class SlashCommandAutocompleteInteraction extends AutocompleteInteraction<SlashCommandAutocompleteType> {
	public readonly command: SlashCommand;
	constructor(
		application: Application,
		command: SlashCommand,
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
