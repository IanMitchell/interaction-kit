import type {Snowflake} from '../data/snowflake';
import type {GuildMember} from '../records/member';
import type {User} from '../records/user';
import type {Channel} from '../records/channel';
import type {Role} from '../records/role';
import type {Embed} from '../components/embed';

export type ApplicationCommand = {
	id: Snowflake;
	application_id: Snowflake;
	name: string;
	description: string;
	options?: ApplicationCommandOption[];
	default_permission?: boolean;
};

export type ApplicationCommandOption = {
	type: ApplicationCommandOptionType;
	name: string;
	description: string;
	required?: boolean;
	choices?: ApplicationCommandOptionChoice[];
	options?: ApplicationCommandOption[];
};

export enum ApplicationCommandOptionType {
	SUB_COMMAND = 1,
	SUB_COMMAND_GROUP = 2,
	STRING = 3,
	INTEGER = 4,
	BOOLEAN = 5,
	USER = 6,
	CHANNEL = 7,
	ROLE = 8,
	MENTIONABLE = 9,
}

export type ApplicationCommandOptionChoice = {
	name: string;
	value: string | number;
};

export type GuildApplicationCommandPermissions = {
	id: Snowflake;
	application_id: Snowflake;
	guild_id: Snowflake;
	permissions: ApplicationCommandPermissions[];
};

export type ApplicationCommandPermissions = {
	id: Snowflake;
	type: ApplicationCommandPermissionType;
	permission: boolean;
};

export enum ApplicationCommandPermissionType {
	ROLE = 1,
	USER = 2,
}

export type Interaction = {
	id: Snowflake;
	application_id: Snowflake;
	type: InteractionType;
	data?: ApplicationCommandInteractionData;
	guild_id?: Snowflake;
	channel_id?: Snowflake;
	member?: GuildMember;
	user?: User;
	token: string;
	version: number;
};

export enum InteractionType {
	PING = 1,
	APPLICATION_COMMAND = 2,
}

export type ApplicationCommandInteractionData = {
	id: Snowflake;
	name: string;
	resolved?: ApplicationCommandInteractionDataResolved;
	options?: ApplicationCommandInteractionDataOption[];
};

export type ApplicationCommandInteractionDataResolved = {
	users?: Record<Snowflake, User>;
	members?: Record<Snowflake, Omit<GuildMember, 'user' | 'deaf' | 'mute'>>;
	roles?: Record<Snowflake, Role>;
	channels?: Record<
		Snowflake,
		Pick<Channel, 'id' | 'name' | 'type' | 'permissions'>
	>;
};

// TODO: Mutually exclusive, also what is option type?
export type ApplicationCommandInteractionDataOption = {
	name: string;
	type: ApplicationCommandOptionType;
	value?: OptionType;
	options?: ApplicationCommandInteractionDataOption[];
};

// TODO: Check?
export interface InteractionCallbackResponse {
	type: InteractionCallbackType;
	data?: InteractionApplicationCommandCallbackData;
}

export enum InteractionCallbackType {
	PONG = 1,
	CHANNEL_MESSAGE_WITH_SOURCE = 4,
	DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = 5,
}

export interface InteractionApplicationCommandCallbackData {
	tts?: boolean;
	content?: string;
	embeds?: Embed[];
	allowed_mentions?: AllowedMentions;
	flags?: number;
	name?: string;
}

export enum AllowedMentionTypes {
	ROLE = 'roles',
	USER = 'users',
	EVERYONE = 'everyone',
}

export interface AllowedMentions {
	parse: AllowedMentionTypes[];
	roles: Snowflake[];
	users: Snowflake[];
	replied_user: boolean;
}

export interface MessageInteraction {
	id: Snowflake;
	type: InteractionType;
	name: string;
	user: User;
}
