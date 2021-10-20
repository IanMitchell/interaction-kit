import { ApplicationCommand, ApplicationCommandType } from "../definitions";
import Application from "../application";
import { Input } from "../components/inputs";
import { Optional, InteractionKitCommand } from "../interfaces";
import SlashCommandInteraction from "../interactions/application-commands/slash-command-interaction";

type CommandArgs = {
	name: string;
	description: string;
	defaultPermission?: boolean;
	options?: Input[];
	handler: (interaction: SlashCommandInteraction) => unknown;
};

export default class SlashCommand
	implements InteractionKitCommand<SlashCommandInteraction>
{
	public readonly type = ApplicationCommandType.CHAT_INPUT;

	name: string;
	#description: string;
	#defaultPermission: boolean;
	#options: Map<string, Input>;
	handler: (
		interaction: SlashCommandInteraction,
		application: Application
	) => unknown;

	constructor({
		name,
		description,
		options,
		handler,
		defaultPermission = true,
	}: CommandArgs) {
		// TODO: Validate: 1-32 lowercase character name matching ^[\w-]{1,32}$
		this.name = name;
		this.#description = description;
		this.#defaultPermission = defaultPermission;
		this.handler = handler;
		this.#options = new Map();

		options?.forEach((option) => {
			const key = option.name.toLowerCase();
			if (this.#options.has(key)) {
				throw new Error(
					`Option names must be unique (case insensitive). Duplicate name detected: ${key}`
				);
			}

			this.#options.set(key, option);
		});
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

		if (this.#options.size !== (schema.options?.length ?? 0)) {
			return false;
		}

		return (
			schema.options?.every(
				(option) => this.#options.get(option.name)?.equals(option) ?? false
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
		if (this.#options.size > 0) {
			payload.options = [];

			Array.from(this.#options.entries()).forEach(([_, value]) => {
				payload.options?.push(value.serialize());
			});
		}

		return payload;
	}
}
