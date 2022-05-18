import { InteractionKitCommand } from "../interfaces";
import {
	APIApplicationCommand,
	RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from "discord-api-types/v10";
import ContextMenuInteraction, {
	ContextMenuApplicationCommandType,
} from "../interactions/application-commands/context-menu-interaction";

type ContextMenuArgs<T extends ContextMenuApplicationCommandType> = {
	name: string;
	type: T;
	handler: InteractionKitCommand<ContextMenuInteraction<T>>["handler"];
};

export default class ContextMenu<T extends ContextMenuApplicationCommandType>
	implements InteractionKitCommand<ContextMenuInteraction<T>>
{
	name: string;
	type: T;
	handler: InteractionKitCommand<ContextMenuInteraction<T>>["handler"];

	constructor({ name, type, handler }: ContextMenuArgs<T>) {
		// TODO: Validate: 1-32 lowercase character name matching ^[\w-]{1,32}$
		this.name = name;
		this.type = type;
		this.handler = handler;
	}

	equals(schema: APIApplicationCommand): boolean {
		if (this.name !== schema.name || this.type !== schema.type) {
			return false;
		}

		return true;
	}

	serialize(): RESTPostAPIContextMenuApplicationCommandsJSONBody {
		const payload: RESTPostAPIContextMenuApplicationCommandsJSONBody = {
			name: this.name,
			type: this.type,
		};

		return payload;
	}
}
