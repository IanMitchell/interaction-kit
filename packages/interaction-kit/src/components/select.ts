import { Component, ComponentType } from "../definitions";
import type { SerializableComponent } from "../interfaces";

// TODO: Implement and Validate
export default class Select implements SerializableComponent {
	get type() {
		return ComponentType.SELECT;
	}

	serialize(): Component {
		return {
			type: ComponentType.SELECT,
		};
	}
}
