import MessageComponentInteraction from "../interactions/message-component-interaction";
import Application from "../application";
import { Component, ComponentType } from "../definitions";
import { SerializableComponent } from "../interfaces";
import { SelectOptionList } from "./choices";

type SelectArgs = {
	handler: (
		event: MessageComponentInteraction,
		application: Application
	) => unknown;
	customID: Component["custom_id"];
	min: Component["min_values"];
	max: Component["max_values"];
	options: SelectOptionList;
} & Omit<
	Component,
	| "type"
	| "url"
	| "custom_id"
	| "components"
	| "min_values"
	| "max_values"
	| "options"
>;

export default class Select implements SerializableComponent {
	#customID: SelectArgs["customID"];
	#options: SelectArgs["options"];
	#placeholder: SelectArgs["placeholder"];
	#min: SelectArgs["min"];
	#max: SelectArgs["max"];
	#disabled: SelectArgs["disabled"];
	handler: SelectArgs["handler"];

	constructor(options: SelectArgs) {
		this.#customID = options.customID;
		this.#options = options.options;
		this.#placeholder = options.placeholder;
		this.#min = options.min;
		this.#max = options.max;
		this.#disabled = options.disabled;
		this.handler = options.handler;
	}

	get id() {
		return this.#customID;
	}

	get type() {
		return ComponentType.SELECT;
	}

	setCustomID(customID: SelectArgs["customID"]) {
		this.#customID = customID;
		return this;
	}

	setOptions(options: SelectArgs["options"]) {
		this.#options = options;
		return this;
	}

	setPlaceholder(placeholder: SelectArgs["placeholder"]) {
		this.#placeholder = placeholder;
		return this;
	}

	setMin(min: SelectArgs["min"]) {
		this.#min = min;
		return this;
	}

	setMax(max: SelectArgs["max"]) {
		this.#max = max;
		return this;
	}

	setDisabled(disabled: SelectArgs["disabled"]) {
		this.#disabled = disabled;
		return this;
	}

	setHandler(fn: SelectArgs["handler"]) {
		this.handler = fn;
		return this;
	}

	serialize(): Component {
		const payload: Component = {
			type: ComponentType.SELECT,
			custom_id: this.#customID,
			options: this.#options.serialize(),
		};

		if (this.#placeholder) {
			payload.placeholder = this.#placeholder;
		}

		if (this.#min) {
			payload.min_values = this.#min;
		}

		if (this.#max) {
			payload.max_values = this.#max;
		}

		if (this.#disabled) {
			payload.disabled = this.#disabled;
		}

		return payload;
	}
}
