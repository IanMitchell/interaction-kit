import Application from "../application";
import { ButtonStyle, Component, ComponentType } from "../definitions";
import type { SerializableComponent } from "../interfaces";

type ButtonArgs = {
	handler: (event: ComponentInteraction, application: Application) => unknown;
	customID: Component["custom_id"];
} & Omit<Component, "type" | "url" | "custom_id" | "components">;

type ButtonLinkArgs = Omit<
	Component,
	"type" | "custom_id" | "style" | "components"
>;

// TODO: Add Validations
// TODO: It feels easy to accidentally create invalid buttons here. We should
// consider making this into a Button and ButtonLink
export default class Button implements SerializableComponent {
	#style: ButtonStyle | undefined;
	#label: string | undefined;
	#emoji: Component["emoji"] | null;
	#customID: string | undefined;
	#url: string | undefined;
	#disabled: boolean | undefined;
	handler: (event: ComponentInteraction, application: Application) => unknown;

	constructor(options: ButtonArgs | ButtonLinkArgs) {
		this.#label = options.label;
		this.#emoji = options.emoji;
		this.#disabled = options.disabled;

		// TODO: Figure out how to support this I guess
		this.#customID = options?.customID;
		this.#style = options?.style;
		this.handler = options?.handler;

		this.#url = options?.url;
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

	setHandler(
		fn: (interaction: ComponentInteraction, application: Application) => unknown
	) {
		this.handler = fn;
	}

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
