import type { Executable, SerializableComponent } from "../interfaces";

import Application from "../application";
import { ButtonStyle, Component, ComponentType } from "../definitions";
import ButtonInteraction from "../interactions/message-components/button-interaction";

type ButtonBaseArgs = Omit<
	Component,
	| "type"
	| "url"
	| "custom_id"
	| "components"
	| "options"
	| "placeholder"
	| "min_values"
	| "max_values"
>;

type ButtonArgs = {
	handler: (event: ButtonInteraction, application: Application) => unknown;
	customID: Component["custom_id"];
	style: Exclude<ButtonStyle, ButtonStyle.LINK>;
} & ButtonBaseArgs;

type ButtonLinkArgs = Omit<
	Component,
	"type" | "custom_id" | "style" | "components"
>;

abstract class ButtonBase implements SerializableComponent {
	#style: ButtonStyle | undefined;
	#label: ButtonArgs["label"];
	#emoji: ButtonArgs["emoji"];
	#disabled: ButtonArgs["disabled"];

	constructor(options: ButtonBaseArgs) {
		this.#label = options.label;
		this.#emoji = options.emoji;
		this.#disabled = options.disabled;
		this.#style = options.style;
	}

	get id(): SerializableComponent["id"] {
		return undefined;
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

		if (this.#disabled != null) {
			payload.disabled = this.#disabled;
		}

		return payload;
	}

	protected setStyle(style: ButtonStyle) {
		this.#style = style;
		return this;
	}
}

export class ButtonLink extends ButtonBase {
	#url: ButtonLinkArgs["url"];

	constructor(options: ButtonLinkArgs) {
		super({
			...options,
			style: ButtonStyle.LINK,
		});

		this.#url = options?.url;
	}

	setURL(url: ButtonLinkArgs["url"]) {
		this.#url = url;
		return this;
	}

	serialize(): Component {
		const payload = super.serialize();
		payload.url = this.#url;

		return payload;
	}
}

export class Button
	extends ButtonBase
	implements SerializableComponent, Executable<ButtonInteraction>
{
	#customID: ButtonArgs["customID"];
	handler: ButtonArgs["handler"];

	constructor(options: ButtonArgs) {
		super({
			...options,
			style: options?.style ?? ButtonStyle.PRIMARY,
		});
		this.#customID = options.customID;
		this.handler = options?.handler;

		if (this.#customID == null) {
			throw new Error("Custom ID is required");
		}
	}

	get id() {
		return this.#customID;
	}

	setCustomID(customID: ButtonArgs["customID"]) {
		this.#customID = customID;
		return this;
	}

	setStyle(style: Exclude<ButtonArgs["style"], ButtonStyle.LINK>) {
		super.setStyle(style);
		return this;
	}

	setHandler(fn: ButtonArgs["handler"]) {
		this.handler = fn;
		return this;
	}

	serialize(): Component {
		const payload = super.serialize();

		if (this.#customID != null) {
			payload.custom_id = this.#customID;
		}

		return payload;
	}
}
