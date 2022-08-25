import type {
	APIApplicationCommandAutocompleteInteraction,
	APIApplicationCommandOptionChoice,
} from "discord-api-types/v10";
import { InteractionResponseType } from "discord-api-types/v10";
import type Application from "../../application.js";
import type SlashCommand from "../../commands/slash-command.js";
import type { RequestBody, ResponseHandler } from "../../interfaces.js";
import AutocompleteInteraction from "./autocomplete-interaction.js";

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
