import type { ApplicationCommand } from "./definitions";
import Application from "./application";
import { Input } from "./components/inputs";
import Interaction from "./interaction";
import { Serializable } from "./interfaces";

type CommandArgs = {
	name: string;
	description: string;
	defaultPermission?: boolean;
	options?: Input[];
	handler: (interaction: Interaction) => unknown;
};

export default class Command implements Serializable {
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

		options?.forEach((option) => {
			const key = option.name.toLowerCase();
			if (this.#options.has(key)) {
				throw new Error(
					`Option names must be unique (case insensitive). Duplicate name detected: ${key}`
				);
			}

			this.#options.set(option.name.toLowerCase(), option);
		});
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
	equals(schema: ApplicationCommand): boolean {
		if (
			this.name !== schema.name ||
			this.#description !== schema.description ||
			this.#defaultPermission !== schema.default_permission
		) {
			return false;
		}

		if (schema.options?.length !== this.#options.size) {
			return false;
		}

		// TODO: Also check the below
		// return schema.options?.every(option => {
		//   option.name
		//   option.description
		//   option.type
		//   option.required
		//   option.choices
		//   option.options
		// })
		// return true;

		return false;
	}

	serialize(): Omit<ApplicationCommand, "id" | "application_id"> {
		const payload: Omit<ApplicationCommand, "id" | "application_id"> = {
			name: this.name,
			description: this.#description,
		};

		if (!this.#defaultPermission) {
			payload.default_permission = this.#defaultPermission;
		}

		if (this.#options.size > 0) {
			payload.options = [];

			Array.from(this.#options.entries()).forEach(([key, value]) => {
				// TODO: Why does this error?!?
				payload.options?.push(value.serialize());
			});
		}

		console.log({ payload });
		console.log({ opts: payload.options });
		return payload;
	}
}
