import type { SerializableComponent } from "../interfaces";

import Application from "../application";
import { Component, ComponentType } from "../definitions";

type ButtonArgs = {
	handler: (event: ComponentInteraction, application: Application) => unknown;
	customID: Component["custom_id"];
} & Omit<Component, "type" | "url" | "custom_id" | "components">;

type ButtonLinkArgs = Omit<
	Component,
	"type" | "custom_id" | "style" | "components"
>;

function isButtonLink(
	options: ButtonArgs | ButtonLinkArgs
): options is ButtonLinkArgs {
	return (options as ButtonLinkArgs).url != null;
}

export default class Button implements SerializableComponent {
	#style: ButtonArgs["style"];
	#label: ButtonArgs["label"];
	#emoji: ButtonArgs["emoji"];
	#customID: ButtonArgs["customID"];
	#url: ButtonLinkArgs["url"];
	#disabled: ButtonArgs["disabled"];
	handler: ButtonArgs["handler"] | undefined;

	constructor(options: ButtonArgs | ButtonLinkArgs) {
		this.#label = options.label;
		this.#emoji = options.emoji;
		this.#disabled = options.disabled;

		if (isButtonLink(options)) {
			this.#url = options?.url;
		} else {
			this.#customID = options?.customID;
			this.#style = options?.style;
			this.handler = options?.handler;
		}
	}

	get id() {
		return this.#customID;
	}

	get type() {
		return ComponentType.BUTTON;
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

	setStyle(style: ButtonArgs["style"]) {
		this.#style = style;
		return this;
	}

	setHandler(fn: ButtonArgs["handler"]) {
		this.handler = fn;
		return this;
	}

	// TODO: Can we throw type errors if this is used on a non-link button?
	setURL(url: ButtonLinkArgs["url"]) {
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
