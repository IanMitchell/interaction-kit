/**
 * These type definitions come from the official Discord API docs. They should
 * be defined with references back to the documentation section.
 */

import type { Snowflake } from "./snowflakes";
import type { GuildMember } from "./guild-members";
import { User } from "./users";
import { AllowedMentions, Channel } from "./channels";
import { Embed } from "./embeds";
import { Role } from "./roles";

// https://discord.com/developers/docs/interactions/slash-commands#applicationcommand
export type ApplicationCommand = {
	id: Snowflake;
	application_id: Snowflake;
	name: string;
	description: string;
	options?: ApplicationCommandOption[];
	default_permission?: boolean;
};

// https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoption
export type ApplicationCommandOption = {
	type: ApplicationCommandOptionType;
	name: string;
	description: string;
	required?: boolean;
	choices?: ApplicationCommandOptionChoice[];
	options?: ApplicationCommandOption[];
};

// https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoptiontype
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

// https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoptionchoice
export type ApplicationCommandOptionChoice = {
	name: string;
	value: string | number;
};

// https://discord.com/developers/docs/interactions/slash-commands#guildapplicationcommandpermissions
export type GuildApplicationCommandPermissions = {
	id: Snowflake;
	application_id: Snowflake;
	guild_id: Snowflake;
	permissions: ApplicationCommandPermissions[];
};

// https://discord.com/developers/docs/interactions/slash-commands#applicationcommandpermissions
export type ApplicationCommandPermissions = {
	id: Snowflake;
	type: ApplicationCommandPermissionType;
	permission: boolean;
};

// https://discord.com/developers/docs/interactions/slash-commands#applicationcommandpermissiontype
export enum ApplicationCommandPermissionType {
	ROLE = 1,
	USER = 2,
}

// https://discord.com/developers/docs/interactions/slash-commands#interaction
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

// https://discord.com/developers/docs/interactions/slash-commands#interaction-interactiontype
export enum InteractionType {
	PING = 1,
	APPLICATION_COMMAND = 2,
}

// https://discord.com/developers/docs/interactions/slash-commands#interaction-applicationcommandinteractiondata
export type ApplicationCommandInteractionData = {
	id: Snowflake;
	name: string;
	resolved?: ApplicationCommandInteractionDataResolved;
	options?: ApplicationCommandInteractionDataOption[];
};

// https://discord.com/developers/docs/interactions/slash-commands#interaction-applicationcommandinteractiondataresolved
export type ApplicationCommandInteractionDataResolved = {
	users?: Record<Snowflake, User>;
	members?: Record<Snowflake, Omit<GuildMember, "user" | "deaf" | "mute">>;
	roles?: Record<Snowflake, Role>;
	channels?: Record<
		Snowflake,
		Pick<Channel, "id" | "name" | "type" | "permissions">
	>;
};

// https://discord.com/developers/docs/interactions/slash-commands#interaction-applicationcommandinteractiondataoption
// TODO: Mutually exclusive, also what is option type?
export type ApplicationCommandInteractionDataOption = {
	name: string;
	type: ApplicationCommandOptionType;
	value?: OptionType; // FIXME: This needs to be set correctly
	options?: ApplicationCommandInteractionDataOption[];
};

// HACK: This is to fix typechecking
export type OptionType = unknown;

// https://discord.com/developers/docs/interactions/slash-commands#interaction-response
// TODO: Check?
export type InteractionResponse = {
	type: InteractionCallbackType;
	data?: InteractionApplicationCommandCallbackData;
};

// https://discord.com/developers/docs/interactions/slash-commands#interaction-response-interactioncallbacktype
export enum InteractionCallbackType {
	PONG = 1,
	CHANNEL_MESSAGE_WITH_SOURCE = 4,
	DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = 5,
}

// https://discord.com/developers/docs/interactions/slash-commands#interaction-response-interactionapplicationcommandcallbackdata
export type InteractionApplicationCommandCallbackData = {
	tts?: boolean;
	content?: string;
	embeds?: Embed[];
	allowed_mentions?: AllowedMentions;
	flags?: number;
};

// https://discord.com/developers/docs/interactions/slash-commands#messageinteraction
export type MessageInteraction = {
	id: Snowflake;
	type: InteractionType;
	name: string;
	user: User;
};
