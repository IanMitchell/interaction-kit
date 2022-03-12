import Application from "../application";
import Option from "./options/option";
import { InteractionKitCommand } from "../interfaces";
import SlashCommandInteraction from "../interactions/application-commands/slash-command-interaction";
import {
	APIApplicationCommand,
	ApplicationCommandType,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord-api-types/v9";
import SlashCommandAutocompleteInteraction from "../interactions/autocomplete/application-command-autocomplete";

type CommandArgs = {
	name: string;
	description: string;
	defaultPermission?: boolean;
	options?: Option[];
	trigger?: (name: string) => boolean;
	onInteraction: (
		interaction: SlashCommandInteraction,
		application: Application
	) => void;
	onAutocomplete?: never;
};

type AutocompleteCommandArgs = {
	name: string;
	description: string;
	defaultPermission?: boolean;
	options?: never;
	trigger?: (name: string) => boolean;
	onInteraction: (
		interaction: SlashCommandInteraction,
		application: Application
	) => void;
	onAutocomplete?: (
		interaction: SlashCommandAutocompleteInteraction,
		application: Application
	) => void;
};

export default class SlashCommand
	implements InteractionKitCommand<SlashCommandInteraction>
{
	public readonly type = ApplicationCommandType.ChatInput;

	name: string;
	#description: string;
	#defaultPermission: boolean;
	options: Map<string, Option>;

	onInteraction: (
		interaction: SlashCommandInteraction,
		application: Application
	) => void;

	onAutocomplete?: (
		interaction: SlashCommandAutocompleteInteraction,
		application: Application
	) => void;

	trigger?: (name: string) => boolean;

	constructor({
		name,
		description,
		options,
		onInteraction,
		onAutocomplete,
		trigger,
		defaultPermission = true,
	}: CommandArgs | AutocompleteCommandArgs) {
		// TODO: Validate: 1-32 lowercase character name matching ^[\w-]{1,32}$
		this.name = name;
		this.#description = description;
		this.#defaultPermission = defaultPermission;
		this.options = new Map();
		this.onInteraction = onInteraction;
		this.onAutocomplete = onAutocomplete;
		this.trigger = trigger;

		options?.forEach((option) => {
			const key = option.name.toLowerCase();
			if (this.options.has(key)) {
				throw new Error(
					`Option names must be unique (case insensitive). Duplicate name detected: ${key}`
				);
			}

			this.options.set(key, option);
		});
	}

	group() {
		throw new Error("Unimplemented");
	}

	subcommand() {
		throw new Error("Unimplemented");
	}

	equals(schema: APIApplicationCommand): boolean {
		if (
			this.name !== schema.name ||
			this.#description !== schema.description ||
			this.#defaultPermission !== schema.default_permission
		) {
			return false;
		}

		if (this.options.size !== (schema.options?.length ?? 0)) {
			return false;
		}

		return (
			schema.options?.every(
				(option) => this.options.get(option.name)?.equals(option) ?? false
			) ?? true
		);
	}

	serialize(): RESTPostAPIChatInputApplicationCommandsJSONBody {
		const payload: RESTPostAPIChatInputApplicationCommandsJSONBody = {
			name: this.name,
			description: this.#description,
		};

		if (!this.#defaultPermission) {
			payload.default_permission = this.#defaultPermission;
		}

		// TODO: Sort these so that required options come first
		if (this.options.size > 0) {
			payload.options = [];

			Array.from(this.options.entries()).forEach(([_, value]) => {
				payload.options?.push(value.serialize());
			});
		}

		return payload;
	}
}
