import type { InteractionResponseType } from "discord-api-types/v10";
import type Application from "../../application.js";
import type {
	IntegerOption,
	NumberOption,
	StringOption,
} from "../../commands/options/index.js";
import type { Awaitable } from "../../interfaces.js";
import type SlashCommandAutocompleteInteraction from "./application-command-autocomplete.js";

// 🥺 selects when, discord?
export type AutocompleteInteractionResponseTypes =
	InteractionResponseType.ApplicationCommandAutocompleteResult;
export type AutocompleteInteractionTypes = SlashCommandAutocompleteInteraction;
export type AutocompleteTypes = SlashCommandAutocompleteType;

// Slash command specific
export type SlashCommandAutocompleteType =
	| StringOption
	| IntegerOption
	| NumberOption;

export interface Autocomplete<T extends AutocompleteInteractionTypes> {
	autocomplete?: (
		interaction: T,
		application: Application,
		request: Request
	) => Awaitable;
}
