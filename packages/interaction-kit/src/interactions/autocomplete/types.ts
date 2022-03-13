import { InteractionResponseType } from "discord-api-types/v9";
import Application from "../../application";
import {
	IntegerOption,
	NumberOption,
	StringOption,
} from "../../commands/options";
import SlashCommandAutocompleteInteraction from "./application-command-autocomplete";

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

export interface RenameThisAutocompleteInterface<
	T extends AutocompleteInteractionTypes
> {
	autocomplete?: (interaction: T, application: Application) => Promise<void>;
}
