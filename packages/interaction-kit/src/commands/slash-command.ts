import { ApplicationCommand, ApplicationCommandType } from "../definitions";
import Application from "../application";
import type { InputKey } from "../components/inputs";
import { Optional, InteractionKitCommand } from "../interfaces";
import SlashCommandInteraction from "../interactions/application-commands/slash-command-interaction";
import SlashCommandAutocompleteInteraction from "../interactions/autcomplete/application-command-autocomplete";

// TODO: options OR autocomplete
type CommandArgs<V extends InputKey, T extends readonly [V, ...V[]] | []> = {
	name: string;
	description: string;
	defaultPermission?: boolean;
	options?: T;
	onAutocomplete?: (
		interaction: SlashCommandAutocompleteInteraction,
		application: Application
	) => void;
	handler: (interaction: SlashCommandInteraction<T>) => void;
};

export default class SlashCommand<
	V extends InputKey,
	T extends readonly [V, ...V[]] | []
> implements InteractionKitCommand<SlashCommandInteraction<T>>
{
	public readonly type = ApplicationCommandType.CHAT_INPUT;

	name: string;
	#description: string;
	#defaultPermission: boolean;
	onAutocomplete?: (
		interaction: SlashCommandAutocompleteInteraction,
		application: Application
	) => void;

	handler: (
		interaction: SlashCommandInteraction<T>,
		application: Application
	) => void;

	private readonly options: T;

	constructor({
		name,
		description,
		options,
		onAutocomplete,
		handler,
		defaultPermission = true,
	}: CommandArgs<V, T>) {
		// TODO: Validate: 1-32 lowercase character name matching ^[\w-]{1,32}$
		this.name = name;
		this.#description = description;
		this.#defaultPermission = defaultPermission;
		this.handler = handler;
		this.onAutocomplete = onAutocomplete;

		this.options = options ?? ([] as T);
	}

	group() {
		throw new Error("Unimplemented");
	}

	subcommand() {
		throw new Error("Unimplemented");
	}

	equals(schema: ApplicationCommand): boolean {
		if (
			this.name !== schema.name ||
			this.#description !== schema.description ||
			this.#defaultPermission !== schema.default_permission
		) {
			return false;
		}

		if (this.options.length !== (schema.options?.length ?? 0)) {
			return false;
		}

		return (
			schema.options?.every(
				(option) =>
					this.options
						.find((opt) => opt.name === option.name)
						?.equals(option) ?? false
			) ?? true
		);
	}

	serialize(): Optional<ApplicationCommand, "id" | "application_id"> {
		const payload: Optional<ApplicationCommand, "id" | "application_id"> = {
			name: this.name,
			description: this.#description,
		};

		if (!this.#defaultPermission) {
			payload.default_permission = this.#defaultPermission;
		}

		// TODO: Sort these so that required options come first
		if (this.options.length > 0) {
			payload.options = [];

			this.options.forEach((value) => {
				payload.options?.push(value.serialize());
			});
		}

		return payload;
	}
}
