import type {
	APIApplicationCommand,
	PermissionFlagsBits,
	RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from "discord-api-types/v10";
import type ContextMenuInteraction from "../interactions/application-commands/context-menu-interaction.js";
import type { ContextMenuApplicationCommandType } from "../interactions/application-commands/context-menu-interaction.js";
import type { InteractionKitCommand, ValueOf } from "../interfaces.js";

type ContextMenuArgs<T extends ContextMenuApplicationCommandType> = {
	name: string;
	type: T;
	defaultPermissions?: Array<ValueOf<typeof PermissionFlagsBits>>;
	handler: InteractionKitCommand<ContextMenuInteraction<T>>["handler"];
};

export default class ContextMenu<T extends ContextMenuApplicationCommandType>
	implements InteractionKitCommand<ContextMenuInteraction<T>>
{
	name: string;
	type: T;
	defaultPermissions: null | bigint;
	handler: InteractionKitCommand<ContextMenuInteraction<T>>["handler"];

	constructor({ name, type, defaultPermissions, handler }: ContextMenuArgs<T>) {
		// TODO: Validate: 1-32 lowercase character name matching ^[\w-]{1,32}$
		this.name = name;
		this.type = type;
		this.handler = handler;

		this.defaultPermissions =
			defaultPermissions?.reduce(
				(value, permission) => value | permission,
				0n
			) ?? null;
	}

	equals(schema: APIApplicationCommand): boolean {
		if (this.name !== schema.name || this.type !== schema.type) {
			return false;
		}

		if (this.defaultPermissions !== schema.default_member_permissions) {
			return false;
		}

		return true;
	}

	serialize(): RESTPostAPIContextMenuApplicationCommandsJSONBody {
		const payload: RESTPostAPIContextMenuApplicationCommandsJSONBody = {
			name: this.name,
			type: this.type,
		};

		if (this.defaultPermissions != null) {
			payload.default_member_permissions = this.defaultPermissions.toString();
		}

		return payload;
	}
}
