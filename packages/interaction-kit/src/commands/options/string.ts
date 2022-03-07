import {
	APIApplicationCommandStringOption,
	ApplicationCommandOptionType,
} from "discord-api-types/payloads/v9";
import Application from "../../application";
import SlashCommandAutocompleteInteraction from "../../interactions/autocomplete/application-command-autocomplete";
import { SlashChoiceList } from "./choices";
import Option, { BaseOptionArgs, Autocomplete } from "./option";

interface StringOptionChoiceArgs extends BaseOptionArgs {
	choices?: SlashChoiceList<string>;
	onAutocomplete: never;
}

interface StringAutocompleteArgs extends BaseOptionArgs {
	choices: never;
	onAutocomplete: (
		interaction: SlashCommandAutocompleteInteraction,
		application: Application
	) => void;
}

export default class StringOption extends Option {
	public readonly choices?: SlashChoiceList<string>;

	onAutocomplete?: (
		interaction: SlashCommandAutocompleteInteraction,
		application: Application
	) => void;

	constructor({
		choices,
		onAutocomplete,
		name,
		description,
		required,
	}: StringOptionChoiceArgs | StringAutocompleteArgs) {
		super({
			type: ApplicationCommandOptionType.String,
			name,
			description,
			required,
		});

		/* eslint-disable-next-line no-negated-condition */
		if (onAutocomplete != null) {
			this.onAutocomplete = onAutocomplete;
		} else {
			this.choices = choices;
		}
	}

	isAutocomplete(
		_payload: APIApplicationCommandStringOption
	): _payload is Autocomplete<ApplicationCommandOptionType.String> {
		return this.onAutocomplete != null;
	}

	equals(schema: APIApplicationCommandStringOption): boolean {
		if (schema.autocomplete) {
			if (this.onAutocomplete == null) {
				return false;
			}
		} else {
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

	serialize(): APIApplicationCommandStringOption {
		const payload = super.serialize() as APIApplicationCommandStringOption;

		if (this.isAutocomplete(payload)) {
			payload.autocomplete = true;
		} else {
			payload.choices = this.choices?.serialize();
		}

		return payload;
	}
}
