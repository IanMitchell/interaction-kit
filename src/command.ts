import type { ApplicationCommand } from "./definitions";
import Application from "./application";
import { Input } from "./components/inputs";
import Interaction from "./interaction";
import { JSONAble } from "./interfaces";

type CommandArgs = {
	name: string;
	description: string;
	defaultPermission?: boolean;
	options?: Input[];
	handler: (interaction: Interaction) => unknown;
};

export default class Command implements JSONAble {
	name: string;
	#description: string;
	#defaultPermission: boolean;
	#options: Map<string, Input>;
	handler: (interaction: Interaction, application: Application) => unknown;

	constructor({
		name,
		description,
		options,
		handler,
		defaultPermission = true,
	}: CommandArgs) {
		this.name = name;
		this.#description = description;
		this.#defaultPermission = defaultPermission;
		this.handler = handler;
		this.#options = new Map();

		options?.forEach((option) =>
			this.#options.set(option.name.toLowerCase(), option)
		);
	}

	group() {
		throw new Error("Unimplemented");
	}

	subcommand() {
		throw new Error("Unimplemented");
	}

	/**
	 * Compares if a command is equal to a given command.
	 * @param schema
	 */
	is(schema: ApplicationCommand): boolean {
		// TODO: Also check the below
		// return schema.options?.every(option => {
		//   option.name
		//   option.description
		//   option.type
		//   option.required
		//   option.choices
		//   option.options
		// })

		return !(
			this.name !== schema.name ||
			this.#description !== schema.description ||
			this.#defaultPermission !== schema.default_permission
		);
	}

	/**
	 * Compares if a command is equal to this command.
	 * @deprecated use Command#equals
	 * @param _schema
	 */
	isEqualTo(_schema: ApplicationCommand): boolean {
		throw new Error(
			"Command#isEqualTo is deprecated. Please use Command#equals instead."
		);
	}

	toJSON() {
		const payload: Record<string, unknown> = {
			name: this.name,
			description: this.#description,
		};

		if (!this.#defaultPermission) {
			payload.default_permission = this.#defaultPermission;
		}

		// TODO: Implement this
		if (this.#options.size > 0) {
			// ApplicationCommandOption[]
		}

		return payload;
	}
}
