import { Component, ComponentType } from "../definitions";
import type { SerializableComponent } from "../interfaces";

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
