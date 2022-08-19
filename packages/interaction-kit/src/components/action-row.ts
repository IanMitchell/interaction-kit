import type {
	APIActionRowComponent,
	APIMessageActionRowComponent,
} from "discord-api-types/v10";
import { ComponentType } from "discord-api-types/v10";
import type { SerializableComponent } from "../interfaces.js";
import type { Button } from "./button.js";
import type Select from "./select.js";

export function isActionRow(
	component: SerializableComponent
): component is ActionRow {
	return (component as ActionRow).type === ComponentType.ActionRow;
}

export type ActionRowChildren = Button | Select;

export default class ActionRow implements SerializableComponent {
	components: ActionRowChildren[];

	constructor(...components: ActionRowChildren[]) {
		this.components = [];
		this.setComponents(...components);
	}

	get id() {
		// Discord API has this as undefined, not null
		return undefined;
	}

	get type() {
		return ComponentType.ActionRow;
	}

	get isFull() {
		if (this.components.length === 0) {
			return false;
		}

		if (this.components[0].type === ComponentType.Button) {
			return this.components.length >= 5;
		}

		if (this.components[0].type === ComponentType.SelectMenu) {
			return this.components.length > 0;
		}

		return false;
	}

	setComponents(...components: ActionRowChildren[]) {
		components.forEach((component) => {
			this.addComponent(component);
		});
	}

	addComponent(component: ActionRowChildren) {
		if (component.type === ComponentType.ActionRow) {
			throw new TypeError("An Action Row cannot contain another Action Row");
		} else if (
			component.type === ComponentType.SelectMenu &&
			this.components.length !== 0
		) {
			throw new TypeError(
				"An Action Row must contain exactly 1 Select Component"
			);
		} else if (
			component.type === ComponentType.Button &&
			this.components.length >= 5
		) {
			throw new TypeError(
				"An Action Row can only contain up to 5 Button Components"
			);
		}

		this.components.push(component);
	}

	serialize(): APIActionRowComponent<APIMessageActionRowComponent> {
		return {
			type: ComponentType.ActionRow,
			components: this.components.map((component) => component.serialize()),
		};
	}
}
