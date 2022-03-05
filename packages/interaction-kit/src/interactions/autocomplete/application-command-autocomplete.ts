import Application from "../../application";
import AutocompleteInteraction from "./autocomplete-interaction";
import {
	InteractionKitCommand,
	RequestBody,
	ResponseHandler,
} from "../../interfaces";
import {
	APIApplicationCommandAutocompleteInteraction,
	InteractionResponseType,
} from "discord-api-types/v9";
import { SlashCommandAutocompleteType } from "./types";
import ApplicationCommandInteraction from "../application-commands/application-command-interaction";

export default class SlashCommandAutocompleteInteraction extends AutocompleteInteraction<SlashCommandAutocompleteType> {
	public readonly command:
		| InteractionKitCommand<ApplicationCommandInteraction>
		| undefined;

	constructor(
		application: Application,
		command: InteractionKitCommand<ApplicationCommandInteraction> | undefined,
		json: RequestBody<APIApplicationCommandAutocompleteInteraction>,
		respond: ResponseHandler
	) {
		super(
			application,
			json,
			respond,
			InteractionResponseType.ApplicationCommandAutocompleteResult
		);

		this.command = command;
	}
}
