import { ButtonStyle, Component, ComponentType } from "../definitions";
import type { SerializableComponent } from "../interfaces";

type ButtonArgs = {
	customID: Component["custom_id"];
} & Omit<Component, "type" | "url" | "custom_id" | "components">;

type LinkButtonArgs = {
	url: string;
} & Omit<Component, "type" | "custom_id" | "components">;

// TODO: Add Validations
export default class Button implements SerializableComponent {
	#style: ButtonStyle | undefined;
	#label: string | undefined;
	#emoji: Component["emoji"] | null;
	#customID: string | undefined;
	#url: string | null;
	#disabled: boolean | undefined;

	constructor(options: ButtonArgs | LinkButtonArgs) {
		this.#style = options.style;
		this.#label = options.label;
		this.#emoji = options.emoji;
		this.#customID = options.customID;
		this.#url = options.url;
		this.#disabled = options.disabled;
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

	setURL(url: LinkButtonArgs["url"]) {
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

/**
 * TODO: Do we want to export a ButtonLink class too?
 * It helps typing, and may be easier to read, but it's also potentially
 * divergent and unintuitive since we don't track the API 1:1
 */
