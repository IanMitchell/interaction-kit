import {
	APIApplicationCommandIntegerOption,
	ApplicationCommandOptionType,
} from "discord-api-types/v10";
import SlashCommandAutocompleteInteraction from "../../interactions/autocomplete/application-command-autocomplete";
import { Autocomplete } from "../../interactions/autocomplete/types";
import { Optional } from "../../interfaces";
import { SlashChoiceList } from "./choices";
import {
	BaseBasicOptionArgs,
	AutocompleteCommandOptionType,
	BasicOption,
} from "./option";

interface IntegerOptionChoiceArgs
	extends Optional<BaseBasicOptionArgs, "required"> {
	choices?: SlashChoiceList<number>;
	autocomplete: never;
}

interface IntegerAutocompleteArgs
	extends Optional<BaseBasicOptionArgs, "required"> {
	choices: never;
	autocomplete: Autocomplete<SlashCommandAutocompleteInteraction>["autocomplete"];
}

export default class IntegerOption
	extends BasicOption
	implements Autocomplete<SlashCommandAutocompleteInteraction>
{
	public readonly choices: SlashChoiceList<number> | undefined;

	autocomplete?: Autocomplete<SlashCommandAutocompleteInteraction>["autocomplete"];

	constructor({
		choices,
		autocomplete,
		name,
		description,
		required,
	}: IntegerOptionChoiceArgs | IntegerAutocompleteArgs) {
		super({
			type: ApplicationCommandOptionType.Integer,
			name,
			description,
			required,
		});

		/* eslint-disable-next-line no-negated-condition */
		if (autocomplete != null) {
			this.autocomplete = autocomplete;
		} else {
			this.choices = choices;
		}
	}

	isAutocomplete(
		_payload: APIApplicationCommandIntegerOption
	): _payload is AutocompleteCommandOptionType<ApplicationCommandOptionType.Integer> {
		return this.autocomplete != null;
	}

	equals(schema: APIApplicationCommandIntegerOption): boolean {
		if (schema.autocomplete) {
			if (this.autocomplete == null) {
				return false;
			}

			if (this.choices?._choices.size !== 0) {
				return false;
			}
		} else {
			if (this.autocomplete != null) {
				return false;
			}

			if (
				(this.choices?._choices?.size ?? 0) !== (schema.choices?.length ?? 0)
			) {
				return false;
			}

			const choiceMap = new Map();
			for (const commandOption of this.choices?._choices?.values() ?? []) {
				choiceMap.set(commandOption.name, commandOption.value);
			}

			const choiceEquality =
				schema.choices?.every((choice) => {
					if (!choiceMap.has(choice.name)) {
						return false;
					}

					return choiceMap.get(choice.name) === choice.value;
				}) ?? true;

			if (!choiceEquality) {
				return false;
			}
		}

		return super.equals(schema);
	}

	serialize(): APIApplicationCommandIntegerOption {
		const payload = super.serialize() as APIApplicationCommandIntegerOption;

		if (this.isAutocomplete(payload)) {
			payload.autocomplete = true;
		} else if (this.choices != null) {
			payload.choices = this.choices.serialize();
		}

		return payload;
	}
}
