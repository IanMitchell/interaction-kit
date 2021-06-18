import { Component, ComponentType } from "../definitions";
import type { SerializableComponent } from "../interfaces";
import Button from "./button";

export default class ActionRow implements SerializableComponent {
	#components: SerializableComponent[];

	// TODO: Validate Limits
	constructor(...components: SerializableComponent[]) {
		this.#components = components;
	}

	get type() {
		return ComponentType.ACTION_ROW;
	}

	get isFull() {
		if (this.#components.length === 0) {
			return false;
		}

		if (this.#components[0].type === ComponentType.BUTTON) {
			return this.#components.length >= 5;
		}

		if (this.#components[0].type === ComponentType.SELECT) {
			return this.#components.length >= 1;
		}
	}

	// TODO: Validate limits
	setComponents(...components: SerializableComponent[]) {
		this.#components.push(...components);
	}

	// TODO: Validate limits
	addComponent(component) {
		this.#components.push(component);
	}

	serialize(): Component {
		return {
			type: ComponentType.ACTION_ROW,
			components: this.#components.map((component) => component.serialize()),
		};
	}
}
