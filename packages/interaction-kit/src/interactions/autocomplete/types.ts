import {
	IntegerInput,
	NumberInput,
	StringInput,
} from "../../components/inputs";
import { InteractionCallbackType } from "../../definitions/application-commands";

export type AutocompleteInteractionTypes =
	InteractionCallbackType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT;

export type AutocompleteTypes<T extends string> =
	SlashCommandAutocompleteType<T>;

export type SlashCommandAutocompleteType<T extends string> =
	| StringInput<T>
	| IntegerInput<T>
	| NumberInput<T>;
