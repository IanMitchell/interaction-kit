import { ApplicationCommand, ApplicationCommandType } from "../definitions";
import Application from "../application";
import { Input } from "../components/inputs";
import ApplicationCommandInteraction from "../interactions/application-command-interaction";
import { InteractionKitCommand, Optional } from "../interfaces";

type ContextMenuArgs = {
	name: string;
	type: ApplicationCommandType;
	defaultPermission?: boolean;
	options?: Input[];
	handler: (interaction: ApplicationCommandInteraction) => unknown;
};

export default class ContextMenu implements InteractionKitCommand {
	name: string;
	type: ApplicationCommandType;
	#defaultPermission: boolean;
	handler: (
		interaction: ApplicationCommandInteraction,
		application: Application
	) => unknown;

	constructor({
		name,
		type,
		handler,
		defaultPermission = true,
	}: ContextMenuArgs) {
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
