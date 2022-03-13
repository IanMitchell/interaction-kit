import { InteractionResponseType } from "discord-api-types/v9";
import {
	IntegerOption,
	NumberOption,
	StringOption,
} from "../../commands/options";

export type AutocompleteInteractionTypes =
	InteractionResponseType.ApplicationCommandAutocompleteResult;

// 🥺 selects when, discord?
export type AutocompleteTypes = SlashCommandAutocompleteType;

export type SlashCommandAutocompleteType =
	| StringOption
	| IntegerOption
	| NumberOption;
