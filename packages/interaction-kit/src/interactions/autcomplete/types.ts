import {
	IntegerInput,
	NumberInput,
	StringInput,
} from "../../components/inputs";
import { InteractionCallbackType } from "../../definitions/application-commands";

export type AutocompleteInteractionTypes =
	InteractionCallbackType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT;

export type AutocompleteTypes = SlashCommandAutocompleteType;

export type SlashCommandAutocompleteType =
	| StringInput
	| IntegerInput
	| NumberInput;
