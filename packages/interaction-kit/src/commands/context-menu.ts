import { ApplicationCommand, ApplicationCommandType } from "../definitions";
import Application from "../application";
import { InteractionKitCommand, Optional } from "../interfaces";
import ContextMenuInteraction, {
	ContextMenuApplicationCommandType,
} from "../interactions/application-commands/context-menu-interaction";

type ContextMenuArgs<T extends ContextMenuApplicationCommandType> = {
	name: string;
	type: T;
	defaultPermission?: boolean;
	handler: (
		interaction: ContextMenuInteraction<T>,
		application: Application
	) => void;
};

export default class ContextMenu<T extends ContextMenuApplicationCommandType>
	implements InteractionKitCommand<ContextMenuInteraction<T>>
{
	static readonly USER = ApplicationCommandType.USER;
	static readonly MESSAGE = ApplicationCommandType.MESSAGE;

	name: string;
	type: T;
	#defaultPermission: boolean;
	handler: (
		interaction: ContextMenuInteraction<T>,
		application: Application
	) => void;

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
