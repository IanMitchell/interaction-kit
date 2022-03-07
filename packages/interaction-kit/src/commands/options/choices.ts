import {
	APISelectMenuOption,
	APIApplicationCommandOptionChoice,
} from "discord-api-types/v9";
import { Serializable } from "../../interfaces";

type ChoiceType = APIApplicationCommandOptionChoice | APISelectMenuOption;

export class Choices<T extends ChoiceType> implements Serializable {
	_choices: Map<string, T>;

	constructor(choices: Record<string, T>) {
		this._choices = new Map();

		Object.entries(choices).forEach(([key, value]) => {
			this._choices.set(key, value);
		});
	}

	static create<T extends ChoiceType, U extends Record<string, T>>(
		this: typeof Choices,
		choices: U
	) {
		return Object.freeze(new this(choices)) as Choices<T> & U;
	}

	serialize(): T[] {
		return Array.from(this._choices.values());
	}
}

export class SelectOptionList extends Choices<APISelectMenuOption> {
	constructor(
		choices: Record<string, APISelectMenuOption["value"] | APISelectMenuOption>
	) {
		const values: Record<string, APISelectMenuOption> = {};

		Object.entries(choices).forEach(([key, value]) => {
			if (typeof value === "string") {
				values[key] = { label: value, value };
			} else if (value instanceof Object) {
				values[key] = value;
			} else {
				throw new Error("Unknown Input Format");
			}
		});

		super(values);

		Object.entries(values).forEach(([key, value]) => {
			Object.defineProperty(this, key, {
				writable: false,
				value,
			});
		});
	}
}

export class SlashChoiceList<
	T extends APIApplicationCommandOptionChoice["value"]
> extends Choices<APIApplicationCommandOptionChoice<T>> {
	constructor(
		choices: Record<
			string,
			T | (Omit<APIApplicationCommandOptionChoice, "value"> & { value: T })
		>
	) {
		const values: Record<string, APIApplicationCommandOptionChoice<T>> = {};

		Object.entries(choices).forEach(([key, value]) => {
			if (typeof value === "string") {
				values[key] = { name: value, value };
			} else if (typeof value === "number") {
				values[key] = { name: value.toString(), value };
			} else if (value instanceof Object) {
				values[key] = value;
			} else {
				throw new Error("Unknown Input Format");
			}
		});

		super(values);

		Object.entries(values).forEach(([key, value]) => {
			Object.defineProperty(this, key, {
				writable: false,
				value: value.value,
			});
		});
	}
}
