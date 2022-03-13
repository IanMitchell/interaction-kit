import SelectInteraction from "../interactions/message-components/select-interaction";
import { Executable, SerializableComponent } from "../interfaces";
import { SelectOptionList } from "../commands/options";
import { APISelectMenuComponent, ComponentType } from "discord-api-types/v9";

type SelectArgs = {
	handler: Executable<SelectInteraction>["handler"];
	customID: APISelectMenuComponent["custom_id"];
	min: APISelectMenuComponent["min_values"];
	max: APISelectMenuComponent["max_values"];
	options: SelectOptionList;
} & Omit<
	APISelectMenuComponent,
	| "type"
	| "url"
	| "custom_id"
	| "components"
	| "min_values"
	| "max_values"
	| "options"
>;

export default class Select
	implements SerializableComponent, Executable<SelectInteraction>
{
	options: SelectArgs["options"];
	#customID: APISelectMenuComponent["custom_id"];
	#placeholder: APISelectMenuComponent["placeholder"];
	#min: APISelectMenuComponent["min_values"];
	#max: APISelectMenuComponent["max_values"];
	#disabled: APISelectMenuComponent["disabled"];
	handler: SelectArgs["handler"];

	constructor({
		customID,
		options,
		placeholder,
		min,
		max,
		disabled,
		handler,
	}: SelectArgs) {
		this.#customID = customID;
		this.options = options;
		this.#placeholder = placeholder;
		this.#min = min;
		this.#max = max;
		this.#disabled = disabled;
		this.handler = handler;
	}

	get id() {
		return this.#customID;
	}

	get type() {
		return ComponentType.SelectMenu;
	}

	setCustomID(customID: SelectArgs["customID"]) {
		this.#customID = customID;
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

	serialize(): APISelectMenuComponent {
		const payload: APISelectMenuComponent = {
			type: ComponentType.SelectMenu,
			custom_id: this.#customID,
			options: this.options.serialize(),
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
