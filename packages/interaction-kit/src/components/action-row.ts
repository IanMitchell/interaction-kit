import { Component, ComponentType } from "../definitions";
import type { SerializableComponent } from "../interfaces";
import Button from "./button";

export default class ActionRow implements SerializableComponent {
	#components: SerializableComponent[];

	constructor(...components: SerializableComponent[]) {
		this.#components = [];
		this.setComponents(...components);
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
			return this.#components.length > 0;
		}

		return false;
	}

	setComponents(...components: SerializableComponent[]) {
		components.forEach((component) => this.addComponent(component));
	}

	addComponent(component: SerializableComponent) {
		if (component.type === ComponentType.ACTION_ROW) {
			throw new TypeError("An Action Row cannot contain another Action Row");
		} else if (
			component.type === ComponentType.SELECT &&
			this.#components.length !== 0
		) {
			throw new TypeError(
				"An Action Row must contain exactly 1 Select Component"
			);
		} else if (
			component.type === ComponentType.BUTTON &&
			this.#components.length >= 5
		) {
			throw new TypeError(
				"An Action Row can only contain up to 5 Button Components"
			);
		}

		this.#components.push(component);
	}

	serialize(): Component {
		return {
			type: ComponentType.ACTION_ROW,
			components: this.#components.map((component) => component.serialize()),
		};
	}
}
