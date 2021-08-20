import { ApplicationCommand, ApplicationCommandType } from "../definitions";
import Application from "../application";
import ApplicationCommandInteraction from "../interactions/application-command-interaction";
import { InteractionKitCommand, Optional } from "../interfaces";

export type ContextMenuApplicationCommandType = Exclude<
	ApplicationCommandType,
	ApplicationCommandType.CHAT_INPUT
>;

type ContextMenuArgs<T extends ContextMenuApplicationCommandType> = {
	name: string;
	type: T;
	defaultPermission?: boolean;
	handler: (
		interaction: ApplicationCommandInteraction<T>,
		application: Application
	) => unknown;
};

export default class ContextMenu<T extends ContextMenuApplicationCommandType>
	implements InteractionKitCommand<T>
{
	static USER = ApplicationCommandType.USER;
	static MESSAGE = ApplicationCommandType.MESSAGE;

	name: string;
	type: T;
	#defaultPermission: boolean;
	handler: (
		interaction: ApplicationCommandInteraction<T>,
		application: Application
	) => unknown;

	constructor({
		name,
		type,
		handler,
		defaultPermission = true,
	}: ContextMenuArgs<T>) {
		// TODO: Validate: 1-32 lowercase character name matching ^[\w-]{1,32}$
		this.name = name;
		this.type = type;
		this.#defaultPermission = defaultPermission;
		this.handler = handler;
	}

	equals(schema: ApplicationCommand): boolean {
		if (
			this.name !== schema.name ||
			this.type !== schema.type ||
			this.#defaultPermission !== schema.default_permission
		) {
			return false;
		}

		return true;
	}

	serialize(): Optional<ApplicationCommand, "id" | "application_id"> {
		const payload: Optional<ApplicationCommand, "id" | "application_id"> = {
			name: this.name,
			type: this.type,
		};

		if (!this.#defaultPermission) {
			payload.default_permission = this.#defaultPermission;
		}

		return payload;
	}
}
