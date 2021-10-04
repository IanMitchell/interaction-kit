import Application from "../application";
import { Component, ComponentType } from "../definitions";
import { SerializableComponent, ArrayValue } from "../interfaces";

type SelectArgs = {
	handler: (
		event: MessageComponentInteraction,
		application: Application
	) => unknown;
	customID: Component["custom_id"];
	min: Component["min_values"];
	max: Component["max_values"];
	options: Choices<ArrayValue<Component["options"]>>;
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

	constructor(options: SelectArgs) {
		this.#customID = options.customID;
	}

	get id() {
		return this.#customID;
	}

	get type() {
		return ComponentType.SELECT;
	}

	serialize(): Component {
		const payload: Component = {
			type: ComponentType.SELECT,
		};

		return payload;
	}
}
