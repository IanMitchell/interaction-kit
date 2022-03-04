import type { Executable, SerializableComponent } from "../interfaces";

import Application from "../application";
import ButtonInteraction from "../interactions/message-components/button-interaction";
import {
	APIButtonComponent,
	APIButtonComponentWithCustomId,
	APIButtonComponentWithURL,
	ButtonStyle,
	ComponentType,
} from "discord-api-types/v9";

type ButtonBaseArgs = Omit<
	APIButtonComponent,
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
	customID: APIButtonComponentWithCustomId["custom_id"];
	style: Exclude<ButtonStyle, ButtonStyle.Link>;
} & ButtonBaseArgs;

type ButtonLinkArgs = Omit<
	APIButtonComponentWithURL,
	"type" | "custom_id" | "style" | "components"
>;

abstract class ButtonBase implements SerializableComponent {
	#style: ButtonStyle | undefined;
	#label: APIButtonComponent["label"];
	#emoji: APIButtonComponent["emoji"];
	#disabled: APIButtonComponent["disabled"];

	constructor(options: ButtonBaseArgs) {
		this.#label = options.label;
		this.#emoji = options.emoji;
		this.#disabled = options.disabled;
		this.#style = options.style;
	}

	get id() {
		return undefined;
	}

	get type() {
		return ComponentType.Button;
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

	serialize(): APIButtonComponent {
		const payload: APIButtonComponent = {
			type: ComponentType.Button,
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
			style: ButtonStyle.Link,
		});

		this.#url = options?.url;
	}

	setURL(url: ButtonLinkArgs["url"]) {
		this.#url = url;
		return this;
	}

	serialize() {
		const payload = super.serialize() as APIButtonComponentWithURL;
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
			style: options?.style ?? ButtonStyle.Primary,
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

	setStyle(style: Exclude<ButtonArgs["style"], ButtonStyle.Link>) {
		super.setStyle(style);
		return this;
	}

	setHandler(fn: ButtonArgs["handler"]) {
		this.handler = fn;
		return this;
	}

	serialize(): APIButtonComponentWithCustomId {
		const payload: APIButtonComponentWithCustomId = super.serialize();
		payload.custom_id = this.#customID;
		return payload;
	}
}
