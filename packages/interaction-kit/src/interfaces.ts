import type { Snowflake } from "discord-snowflake";
import ApplicationCommandInteraction from "./interactions/application-commands/application-command-interaction";
import {
	patchInteractionFollowup,
	deleteInteractionFollowup,
} from "discord-api";
import Application from "./application";
import { ResponseStatus } from "./requests/response";
import Embed from "./structures/embed";
import {
	APIApplicationCommand,
	APIMessageComponent,
	ApplicationCommandType,
	ComponentType,
	InteractionType,
	RESTPatchAPIInteractionFollowupJSONBody,
	RESTPostAPIApplicationCommandsJSONBody,
} from "discord-api-types/v10";
import ActionRow from "./components/action-row";
import { Choices, ChoiceType } from "./commands/options/choices";

/**
 * TypeScript Helpers
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type ArrayValue<T> = T extends Array<infer U> ? U : T;

export type MapValue<T> = T extends Map<unknown, infer V> ? V : never;

/**
 * Polyfills and HTTP Definitions
 */

export type RequestBody<T = Record<string, any>> = T;

export type ResponseHandler<T = Record<string, any>> = (
	status: ResponseStatus,
	json: T
) => void;

/**
 * Discord Structures
 */

export interface Mentionable {
	id: Snowflake;
}

/**
 * Internal Structures
 */

export interface Comparable<T> {
	equals: (schema: T) => boolean;
}

export interface Serializable<T = unknown> {
	serialize(): T;
}

export interface SerializableComponent extends Serializable {
	get id(): string | undefined; // TODO: Type this better
	get type(): ComponentType;
	serialize(): APIMessageComponent;
}

export type InteractionReply = {
	message?: string;
	embed?: Embed | Embed[] | null;
	components?: ActionRow[] | null;
	ephemeral?: boolean;
	queue?: boolean;
};

export type InteractionMessageModifiers = {
	edit: (
		data: RESTPatchAPIInteractionFollowupJSONBody,
		id?: string
	) => ReturnType<typeof patchInteractionFollowup>;
	delete: (id?: string) => ReturnType<typeof deleteInteractionFollowup>;
};

export interface Interaction {
	readonly type: InteractionType;
	readonly messages: InteractionMessageModifiers;
	// get channel(): ChannelRecord;
	// get member(): MemberRecord

	defer: () => unknown;
	reply: (message: InteractionReply) => unknown;
}

export interface Autocomplete<T extends ChoiceType> {
	reply: (options: Choices<T>) => unknown;
}

export interface Executable<T extends Interaction = Interaction> {
	matches?: (customId: string) => Promise<boolean>;
	handler: (
		interaction: T,
		application: Application
		// TODO: Add request?
		// request: Request
	) => void;
}

export interface InteractionKitCommand<T extends ApplicationCommandInteraction>
	extends Executable<T>,
		Serializable<RESTPostAPIApplicationCommandsJSONBody>,
		Comparable<APIApplicationCommand> {
	name: string;
	handler: (
		interaction: T,
		application: Application
		// TODO: Add request?
		// request: Request
	) => void;
	get type(): ApplicationCommandType;
}
