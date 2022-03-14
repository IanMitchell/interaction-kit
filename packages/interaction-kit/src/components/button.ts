import type { Executable, SerializableComponent } from "../interfaces";

import ButtonInteraction from "../interactions/message-components/button-interaction";
import {
	APIBaseComponent,
	APIButtonComponent,
	APIButtonComponentWithCustomId,
	APIButtonComponentWithURL,
	APIMessageComponentEmoji,
	ButtonStyle,
	ComponentType,
} from "discord-api-types/v9";

// Testing the API Base
interface APIButtonComponentBase<Style extends ButtonStyle>
	extends APIBaseComponent<ComponentType.Button> {
	label?: string;
	style: Style;
	emoji?: APIMessageComponentEmoji;
	disabled?: boolean;
}

type ButtonBaseArgs<T extends ButtonStyle> = Omit<
	APIButtonComponent,
	| "type"
	| "url"
	| "custom_id"
	| "components"
	| "options"
	| "placeholder"
	| "min_values"
	| "max_values"
	| "style"
> & { style: T };

type ButtonArgs = {
	customId: APIButtonComponentWithCustomId["custom_id"];
	handler: Executable<ButtonInteraction>["handler"];
	customID: APIButtonComponentWithCustomId["custom_id"];
	style: Exclude<ButtonStyle, ButtonStyle.Link>;
	matches?: Executable<ButtonInteraction>["matches"];
} & ButtonBaseArgs<Exclude<ButtonStyle, ButtonStyle.Link>>;

type ButtonLinkArgs = Omit<
	APIButtonComponentWithURL,
	"type" | "custom_id" | "style" | "components"
>;

abstract class ButtonBase<T extends ButtonStyle> {
	#style: T;
	#label: APIButtonComponent["label"];
	#emoji: APIButtonComponent["emoji"];
	#disabled: APIButtonComponent["disabled"];

	constructor({ label, emoji, disabled, style }: ButtonBaseArgs<T>) {
		this.#label = label;
		this.#emoji = emoji;
		this.#disabled = disabled;
		this.#style = style;
	}

	get id(): SerializableComponent["id"] {
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

	serialize(): APIButtonComponentBase<T> {
		const payload: APIButtonComponentBase<T> = {
			type: ComponentType.Button,
			style: this.#style,
		};

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

	protected setStyle(style: T) {
		this.#style = style;
		return this;
	}
}

export class ButtonLink extends ButtonBase<ButtonStyle.Link> {
	#url: ButtonLinkArgs["url"];

	constructor({ disabled, emoji, label, url }: ButtonLinkArgs) {
		super({
			disabled,
			emoji,
			label,
			style: ButtonStyle.Link,
		});

		this.#url = url;
	}

	setURL(url: ButtonLinkArgs["url"]) {
		this.#url = url;
		return this;
	}

	serialize(): APIButtonComponentWithURL {
		const base = super.serialize();

		return {
			...base,
			url: this.#url,
		};
	}
}

export class Button
	extends ButtonBase<Exclude<ButtonStyle, ButtonStyle.Link>>
	implements SerializableComponent, Executable<ButtonInteraction>
{
	#customId: ButtonArgs["customId"];
	matches: ButtonArgs["matches"];
	handler: ButtonArgs["handler"];

	constructor({
		handler,
		customId,
		style,
		matches,
		disabled,
		emoji,
		label,
	}: ButtonArgs) {
		super({
			disabled,
			emoji,
			label,
			style: style ?? ButtonStyle.Primary,
		});
		this.#customId = customId;
		this.matches = matches;
		this.handler = handler;

		if (this.#customId == null) {
			throw new Error("Custom ID is required");
		}
	}

	get id() {
		return this.#customId;
	}

	setCustomId(customId: ButtonArgs["customId"]) {
		this.#customId = customId;
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

	setMatches(fn: ButtonArgs["matches"]) {
		this.matches = fn;
		return this;
	}

	serialize(): APIButtonComponentWithCustomId {
		const base = super.serialize();

		return {
			...base,
			custom_id: this.#customId,
		};
	}
}
