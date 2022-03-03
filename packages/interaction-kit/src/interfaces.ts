import ApplicationCommandInteraction from "./interactions/application-commands/application-command-interaction";
import * as API from "./api";
import Application from "./application";
import { ResponseStatus } from "./requests/response";

export type Snowflake = `${bigint}`;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type ArrayValue<T> = T extends Array<infer U> ? U : T;

// TODO: Is there a better way of handling these next three types?
export interface FetchEvent extends Event {
	request: Request;
	respondWith(response: Promise<Response> | Response): Promise<Response>;
}
export type RequestBody<T = Record<string, any>> = T;
export type ResponseHandler = (
	status: ResponseStatus,
	json: Record<string, any>
) => void;

export interface Mentionable {
	id: Snowflake;
}

export interface Comparable<T> {
	equals: (schema: T) => boolean;
}

export interface Serializable<T = unknown> {
	serialize(): T;
}

export interface SerializableComponent extends Serializable {
	get id(): Component["custom_id"];
	get type(): ComponentType;
	serialize(): Component;
}

export type InteractionReply = {
	message?: string;
	embed?: Embed | Embed[] | null;
	components?: SerializableComponent[] | null;
	ephemeral?: boolean;
	queue?: boolean;
};

export type InteractionMessageModifiers = {
	edit: (
		data: InteractionApplicationCommandCallbackData,
		id?: string
	) => ReturnType<typeof API.patchInteractionFollowup>;
	delete: (id?: string) => ReturnType<typeof API.deleteInteractionFollowup>;
};

export interface Interaction {
	readonly type: InteractionRequestType;
	readonly messages: InteractionMessageModifiers;
	// get channel(): ChannelRecord;
	// get member(): MemberRecord

	defer: () => unknown;
	reply: (message: InteractionReply) => unknown;
}

export interface Executable<T extends Interaction = Interaction> {
	handler: (interaction: T, application: Application) => unknown;
}

export interface InteractionKitCommand<T extends ApplicationCommandInteraction>
	extends Executable<T>,
		Serializable<Optional<ApplicationCommand, "id" | "application_id">>,
		Comparable<ApplicationCommand> {
	name: string;
	handler: (interaction: T, application: Application) => unknown;
	get type(): ApplicationCommandType;
}
