import { ApplicationCommandOptionChoice, SelectOption } from "../definitions";
import { Serializable } from "../interfaces";

type ChoiceType = ApplicationCommandOptionChoice | SelectOption;

export class Choices<T extends ChoiceType> implements Serializable {
	_choices: Map<string, T>;

	constructor(choices: Record<string, T>) {
		this._choices = new Map();

		Object.entries(choices).forEach(([key, value]) => {
			this._choices.set(key, value);
			Object.defineProperty(this, key, {
				writable: false,
				value: value.value,
			});
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

export class SelectOptionList extends Choices<SelectOption> {
	constructor(choices: Record<string, SelectOption["value"] | SelectOption>) {
		const values: Record<string, SelectOption> = {};

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
	}
}

export class SlashChoiceList<
	T extends ApplicationCommandOptionChoice["value"]
> extends Choices<ApplicationCommandOptionChoice> {
	constructor(
		choices: Record<
			string,
			T | (Omit<ApplicationCommandOptionChoice, "value"> & { value: T })
		>
	) {
		const values: Record<string, ApplicationCommandOptionChoice> = {};

		Object.entries(choices).forEach(([key, value]) => {
			if (typeof value === "string") {
				values[key] = { name: value, value };
			} else if (typeof value === "number") {
				values[key] = { name: value.toString(), value: value.toString() };
			} else if (value instanceof Object) {
				values[key] = value;
			} else {
				throw new Error("Unknown Input Format");
			}
		});

		super(values);
	}
}
