import * as API from "./api";
import Application from "./application";
import Embed from "./components/embed";
import {
	Component,
	ComponentType,
	InteractionApplicationCommandCallbackData,
	InteractionRequestType,
	Snowflake,
} from "./definitions";

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export interface Mentionable {
	id: Snowflake;
}

export interface Serializable {
	serialize(): unknown;
}

export interface SerializableComponent extends Serializable {
	get id(): Component["custom_id"];
	get type(): ComponentType;
	serialize(): Component;
}

export interface Executable {
	handler: (interaction: Interaction, application: Application) => unknown;
}

export interface Comparable<T> {
	equals: (schema: T) => boolean;
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
	) => ReturnType<typeof API.patchWebhookMessage>;
	delete: (id?: string) => ReturnType<typeof API.deleteWebhookMessage>;
};

export interface Interaction {
	readonly type: InteractionRequestType;
	readonly messages: InteractionMessageModifiers;
	// get channel(): ChannelRecord;
	// get member(): MemberRecord

	acknowledge: () => unknown;
	reply: (message: InteractionReply) => unknown;
}
