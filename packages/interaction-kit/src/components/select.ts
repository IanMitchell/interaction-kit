import Application from "../application";
import { MessageComponentInteraction } from "..";
import { Component, ComponentType } from "../definitions";
import { SerializableComponent } from "../interfaces";

type SelectArgs = {
	handler: (
		event: MessageComponentInteraction,
		application: Application
	) => unknown;
	customID: Component["custom_id"];
} & Omit<Component, "type" | "url" | "custom_id" | "components">;

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
