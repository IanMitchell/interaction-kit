import type {
	APIApplicationCommand,
	APIApplicationCommandBasicOption,
	APIApplicationCommandSubcommandGroupOption,
	APIApplicationCommandSubcommandOption,
	APIChatInputApplicationCommandInteraction,
	PermissionFlagsBits,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord-api-types/v10";
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
} from "discord-api-types/v10";
import type SlashCommandInteraction from "../interactions/application-commands/slash-command-interaction.js";
import type SlashCommandAutocompleteInteraction from "../interactions/autocomplete/application-command-autocomplete.js";
import type { Autocomplete } from "../interactions/autocomplete/types.js";
import type {
	ArrayValue,
	InteractionKitCommand,
	Optional,
	RequestBody,
	ValueOf,
} from "../interfaces.js";
import { SubcommandGroup } from "./options/index.js";
import type { BasicOption } from "./options/option.js";
import Subcommand from "./options/subcommand.js";

export type CommandArgs = {
	name: string;
	description: string;
	defaultPermissions?: Array<ValueOf<typeof PermissionFlagsBits>>;
	options?: BasicOption[];
	handler: InteractionKitCommand<SlashCommandInteraction>["handler"];
	autocomplete?: never;
	commands?: never;
};

// TODO: Rename?
export type ParentCommandArgs = {
	name: string;
	description: string;
	defaultPermissions?: never;
	options?: never;
	handler?: never;
	autocomplete?: never;
	commands: Array<Subcommand | SubcommandGroup>;
};

export type AutocompleteCommandArgs = CommandArgs & {
	options?: never;
	autocomplete?: Autocomplete<SlashCommandAutocompleteInteraction>["autocomplete"];
};

export default class SlashCommand
	implements
		Optional<InteractionKitCommand<SlashCommandInteraction>, "handler">,
		Autocomplete<SlashCommandAutocompleteInteraction>
{
	public readonly type = ApplicationCommandType.ChatInput;

	name: string;
	#description: string;
	options: Map<string, BasicOption>;
	defaultPermissions: null | bigint;

	handler?: InteractionKitCommand<SlashCommandInteraction>["handler"];

	autocomplete:
		| Autocomplete<SlashCommandAutocompleteInteraction>["autocomplete"]
		| undefined;
	commands: Map<string, ArrayValue<ParentCommandArgs["commands"]>>;

	constructor({
		name,
		description,
		options,
		defaultPermissions,
		handler,
		autocomplete,
		commands,
	}: CommandArgs | ParentCommandArgs | AutocompleteCommandArgs) {
		// TODO: Validate: 1-32 lowercase character name matching ^[\w-]{1,32}$
		this.name = name;
		this.#description = description;
		this.options = new Map();
		this.commands = new Map(commands?.map((cmd) => [cmd.name, cmd]));

		if (handler != null) {
			this.handler = handler;
		}

		if (autocomplete != null) {
			this.autocomplete = autocomplete;
		}

		options?.forEach((option) => {
			const key = option.name.toLowerCase();
			if (this.options.has(key)) {
				throw new Error(
					`Option names must be unique (case insensitive). Duplicate name detected: ${key}`
				);
			}

			this.options.set(key, option);
		});

		this.defaultPermissions =
			defaultPermissions?.reduce(
				(value, permission) => value | permission,
				0n
			) ?? null;
	}

	equals(schema: APIApplicationCommand): boolean {
		if (this.name !== schema.name || this.#description !== schema.description) {
			return false;
		}

		if (this.options.size !== (schema.options?.length ?? 0)) {
			return false;
		}

		if (this.defaultPermissions !== schema.default_member_permissions) {
			return false;
		}

		if (this.commands.size > 0) {
			// This is a parent command
			return (
				schema.options?.every((option) => {
					const subcommand = this.commands.get(option.name);

					if (subcommand == null) {
						return false;
					}

					if (subcommand.type === ApplicationCommandOptionType.Subcommand) {
						return subcommand.equals(
							option as APIApplicationCommandSubcommandOption
						);
					}

					return subcommand.equals(
						option as APIApplicationCommandSubcommandGroupOption
					);
				}) ?? true
			);
		}

		// This is a normal slash command
		return (
			schema.options?.every(
				(option) =>
					this.options
						.get(option.name)
						?.equals(option as APIApplicationCommandBasicOption) ?? false
			) ?? true
		);
	}

	getCommandHandler(
		json: RequestBody<APIChatInputApplicationCommandInteraction>
	) {
		let options = this.commands;
		let interactionOptions = json.data.options;

		if (
			interactionOptions?.[0]?.type ===
			ApplicationCommandOptionType.SubcommandGroup
		) {
			const option = options.get(interactionOptions[0].name);
			interactionOptions = interactionOptions[0].options;

			if (option instanceof SubcommandGroup) {
				options = option.subcommands;
			}
		}

		if (
			interactionOptions?.[0]?.type === ApplicationCommandOptionType.Subcommand
		) {
			const option = options.get(interactionOptions[0].name);

			if (option instanceof Subcommand) {
				return option.handler;
			}
		}

		if (this.handler == null) {
			// TODO: Throw actual error
			throw new Error(`Unknown handler for interaction ${json.data.name}`);
		}

		return this.handler;
	}

	serialize(): RESTPostAPIChatInputApplicationCommandsJSONBody {
		const payload: RESTPostAPIChatInputApplicationCommandsJSONBody = {
			name: this.name,
			description: this.#description,
		};

		// TODO: Sort these so that required options come first
		if (this.options.size > 0) {
			payload.options = [];

			Array.from(this.options.entries()).forEach(([_, value]) => {
				payload.options?.push(value.serialize());
			});
		}

		if (this.defaultPermissions != null) {
			payload.default_member_permissions = this.defaultPermissions.toString();
		}

		if (this.commands.size > 0) {
			payload.options = Array.from(this.commands.values()).map((cmd) =>
				cmd.serialize()
			);
		}

		return payload;
	}
}
