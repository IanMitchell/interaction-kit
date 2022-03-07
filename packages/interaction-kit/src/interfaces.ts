import ApplicationCommandInteraction from "./interactions/application-commands/application-command-interaction";
import * as API from "./api";
import Application from "./application";
import { ResponseStatus } from "./requests/response";
import { Embed } from "@discordjs/builders";
import {
	APIApplicationCommand,
	APIMessageComponent,
	ApplicationCommandType,
	ComponentType,
	InteractionType,
	RESTPatchAPIInteractionFollowupJSONBody,
	RESTPostAPIApplicationCommandsJSONBody,
} from "discord-api-types/v9";
import ActionRow from "./components/action-row";
import type { Snowflake } from "./structures/snowflake";

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type ArrayValue<T> = T extends Array<infer U> ? U : T;

// TODO: Is there a better way of handling these next three types?
export interface FetchEvent extends Event {
	request: Request;
	respondWith(response: Promise<Response> | Response): Promise<Response>;
}
export type RequestBody<T = Record<string, any>> = T;
export type ResponseHandler<T = Record<string, any>> = (
	status: ResponseStatus,
	json: T
) => Promise<void>;

export interface Mentionable {
	id: Snowflake;
}

export type Module<T> = {
	default: T;
};

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
	) => ReturnType<typeof API.patchInteractionFollowup>;
	delete: (id?: string) => ReturnType<typeof API.deleteInteractionFollowup>;
};

export interface Interaction {
	readonly type: InteractionType;
	readonly messages: InteractionMessageModifiers;
	// get channel(): ChannelRecord;
	// get member(): MemberRecord

	defer: () => unknown;
	reply: (message: InteractionReply) => unknown;
}

export interface Autocomplete<T> {
	reply: (options: T[]) => unknown;
}

export interface Executable<T extends Interaction = Interaction> {
	onInteraction: (
		interaction: T,
		application: Application
		// TODO: Add request?
		// request: Request
	) => unknown;
}

export interface InteractionKitCommand<T extends ApplicationCommandInteraction>
	extends Executable<T>,
		Serializable<RESTPostAPIApplicationCommandsJSONBody>,
		Comparable<APIApplicationCommand> {
	name: string;
	onInteraction: (
		interaction: T,
		application: Application
		// TODO: Add request?
		// request: Request
	) => unknown;
	get type(): ApplicationCommandType;
}
