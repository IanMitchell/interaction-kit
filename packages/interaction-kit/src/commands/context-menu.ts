import Application from "../application";
import { InteractionKitCommand } from "../interfaces";
import ContextMenuInteraction, {
	ContextMenuApplicationCommandType,
} from "../interactions/application-commands/context-menu-interaction";
import {
	APIApplicationCommand,
	ApplicationCommandType,
	RESTPostAPIApplicationCommandsJSONBody,
} from "discord-api-types";

type ContextMenuArgs<T extends ContextMenuApplicationCommandType> = {
	name: string;
	type: T;
	defaultPermission?: boolean;
	handler: (
		interaction: ContextMenuInteraction<T>,
		application: Application
	) => unknown;
};

export default class ContextMenu<T extends ContextMenuApplicationCommandType>
	implements InteractionKitCommand<ContextMenuInteraction<T>>
{
	static readonly USER = ApplicationCommandType.User;
	static readonly MESSAGE = ApplicationCommandType.ChatInput;

	name: string;
	type: T;
	#defaultPermission: boolean;
	handler: (
		interaction: ContextMenuInteraction<T>,
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

	equals(schema: APIApplicationCommand): boolean {
		if (
			this.name !== schema.name ||
			this.type !== schema.type ||
			this.#defaultPermission !== schema.default_permission
		) {
			return false;
		}

		return true;
	}

	serialize(): RESTPostAPIApplicationCommandsJSONBody {
		const payload: RESTPostAPIApplicationCommandsJSONBody = {
			name: this.name,
			type: this.type,
		};

		if (!this.#defaultPermission) {
			payload.default_permission = this.#defaultPermission;
		}

		return payload;
	}
}
