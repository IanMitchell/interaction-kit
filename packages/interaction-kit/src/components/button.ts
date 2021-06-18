import { ButtonStyle, Component, ComponentType } from "../definitions";
import type { SerializableComponent } from "../interfaces";

type ButtonArgs = {
	customID?: string;
} & Omit<Component, "type" | "components" | "customID">;

export default class Button implements SerializableComponent {
	#style: ButtonStyle | null;
	#label: string | null;
	#emoji: Component["emoji"] | null;
	#customID: string | null;
	#url: string | null;
	#disabled: boolean | null;

	constructor({ style, label, emoji, customID, url, disabled }: ButtonArgs) {
		this.#style = style;
		this.#label = label;
		this.#emoji = emoji;
		this.#customID = customID;
		this.#url = url;
		this.#disabled = disabled;
	}

	get type() {
		return ComponentType.BUTTON;
	}

	setStyle(style: ButtonArgs["style"]) {
		this.#style = style;
		return this;
	}

	setLabel(label: ButtonArgs["label"]) {
		this.#label = label;
		return this;
	}

	setEmoji(emoji: ButtonArgs["emoji"]) {
		this.#emoji = emoji;
		return this;
	}

	setCustomID(customID: ButtonArgs["customID"]) {
		this.#customID = customID;
		return this;
	}

	setURL(url: ButtonArgs["url"]) {
		this.#url = url;
		return this;
	}

	setDisabled(disabled: ButtonArgs["disabled"]) {
		this.#disabled = disabled;
		return this;
	}

	serialize(): Component {
		const payload: Component = {
			type: ComponentType.BUTTON,
		};

		if (this.#style != null) {
			payload.style = this.#style;
		}

		if (this.#label != null) {
			payload.label = this.#label;
		}

		if (this.#emoji != null) {
			payload.emoji = this.#emoji;
		}

		if (this.#customID != null) {
			payload.custom_id = this.#customID;
		}

		if (this.#url != null) {
			payload.url = this.#url;
		}

		if (this.#disabled != null) {
			payload.disabled = this.#disabled;
		}

		return payload;
	}
}
