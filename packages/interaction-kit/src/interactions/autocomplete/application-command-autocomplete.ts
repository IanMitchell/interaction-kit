import Application from "../../application";
import AutocompleteInteraction from "./autocomplete-interaction";
import { RequestBody, ResponseHandler } from "../../interfaces";
import {
	APIApplicationCommandAutocompleteInteraction,
	APIApplicationCommandOptionChoice,
	InteractionResponseType,
} from "discord-api-types/v9";
import SlashCommand from "../../commands/slash-command";

export default class SlashCommandAutocompleteInteraction extends AutocompleteInteraction<APIApplicationCommandOptionChoice> {
	public readonly command: SlashCommand | undefined;

	constructor(
		application: Application,
		command: SlashCommand | undefined,
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
