import {
	APIApplicationCommandIntegerOption,
	ApplicationCommandOptionType,
} from "discord-api-types/payloads/v9";
import Application from "../../application";
import SlashCommandAutocompleteInteraction from "../../interactions/autocomplete/application-command-autocomplete";
import { SlashChoiceList } from "./choices";
import Option, { BaseOptionArgs, Autocomplete } from "./option";

interface IntegerOptionChoiceArgs extends BaseOptionArgs {
	choices?: SlashChoiceList<number>;
}

interface IntegerAutocompleteArgs extends BaseOptionArgs {
	onAutocomplete: (
		interaction: SlashCommandAutocompleteInteraction,
		application: Application
	) => void;
}

export default class IntegerOption extends Option {
	public readonly choices: SlashChoiceList<number>;

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
	}: IntegerOptionChoiceArgs | IntegerAutocompleteArgs) {
		super({
			type: ApplicationCommandOptionType.Integer,
			name,
			description,
			required,
		});

		this.choices = choices;
		this.onAutocomplete = onAutocomplete;
	}

	isAutocomplete(
		_payload: APIApplicationCommandIntegerOption
	): _payload is Autocomplete<ApplicationCommandOptionType.Integer> {
		return this.onAutocomplete != null;
	}

	equals(schema: APIApplicationCommandIntegerOption): boolean {
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

	serialize(): APIApplicationCommandIntegerOption {
		const payload = super.serialize() as APIApplicationCommandIntegerOption;

		if (this.isAutocomplete(payload)) {
			payload.autocomplete = true;
		} else {
			payload.choices = this.choices?.serialize();
		}

		return payload;
	}
}
