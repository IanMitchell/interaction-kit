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
import { Component, ComponentType } from "./components";
import { Message } from "./messages";

// https://discord.com/developers/docs/interactions/slash-commands#application-command-object-application-command-structure
export type ApplicationCommand = {
	id: Snowflake;
	application_id: Snowflake;
	name: string;
	description: string;
	options?: ApplicationCommandOption[];
	default_permission?: boolean;
};

// https://discord.com/developers/docs/interactions/slash-commands#application-command-object-application-command-option-structure
export type ApplicationCommandOption = {
	type: ApplicationCommandOptionType;
	name: string;
	description: string;
	required?: boolean;
	choices?: ApplicationCommandOptionChoice[];
	options?: ApplicationCommandOption[];
};

// https://discord.com/developers/docs/interactions/slash-commands#application-command-object-application-command-option-type
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

// https://discord.com/developers/docs/interactions/slash-commands#application-command-object-application-command-option-choice-structure
export type ApplicationCommandOptionChoice = {
	name: string;
	value: string | number;
};

// https://discord.com/developers/docs/interactions/slash-commands#application-command-permissions-object-guild-application-command-permissions-structure
export type GuildApplicationCommandPermissions = {
	id: Snowflake;
	application_id: Snowflake;
	guild_id: Snowflake;
	permissions: ApplicationCommandPermissions[];
};

// https://discord.com/developers/docs/interactions/slash-commands#application-command-permissions-object-application-command-permissions-structure
export type ApplicationCommandPermissions = {
	id: Snowflake;
	type: ApplicationCommandPermissionType;
	permission: boolean;
};

// https://discord.com/developers/docs/interactions/slash-commands#application-command-permissions-object-application-command-permission-type
export enum ApplicationCommandPermissionType {
	ROLE = 1,
	USER = 2,
}

// https://discord.com/developers/docs/interactions/slash-commands#interaction-object-interaction-structure
export type Interaction = {
	id: Snowflake;
	application_id: Snowflake;
	type: InteractionRequestType;
	data?: ApplicationCommandInteractionData;
	guild_id?: Snowflake;
	channel_id?: Snowflake;
	member?: GuildMember;
	user?: User;
	token: string;
	version: number;
	message?: Message;
};

// https://discord.com/developers/docs/interactions/slash-commands#interaction-object-interaction-request-type
export enum InteractionRequestType {
	PING = 1,
	APPLICATION_COMMAND = 2,
	MESSAGE_COMPONENT = 3,
}

// https://discord.com/developers/docs/interactions/slash-commands#interaction-object-application-command-interaction-data-structure
export type ApplicationCommandInteractionData = {
	id: Snowflake;
	name: string;
	resolved?: ApplicationCommandInteractionDataResolved;
	options?: ApplicationCommandInteractionDataOption[];
	custom_id?: string;
	component_type?: ComponentType;
};

// https://discord.com/developers/docs/interactions/slash-commands#interaction-object-application-command-interaction-data-resolved-structure
export type ApplicationCommandInteractionDataResolved = {
	users?: Record<Snowflake, User>;
	members?: Record<Snowflake, Omit<GuildMember, "user" | "deaf" | "mute">>;
	roles?: Record<Snowflake, Role>;
	channels?: Record<
		Snowflake,
		Pick<Channel, "id" | "name" | "type" | "permissions">
	>;
};

// https://discord.com/developers/docs/interactions/slash-commands#interaction-object-application-command-interaction-data-option-structure
// TODO: Mutually exclusive, also what is option type?
export type ApplicationCommandInteractionDataOption = {
	name: string;
	type: ApplicationCommandOptionType;
	value?: OptionType; // FIXME: This needs to be set correctly
	options?: ApplicationCommandInteractionDataOption[];
};

// HACK: This is to fix typechecking
export type OptionType = unknown;

// https://discord.com/developers/docs/interactions/slash-commands#interaction-response-object-interaction-response-structure
// TODO: Check?
export type InteractionResponse = {
	type: InteractionCallbackType;
	data?: InteractionApplicationCommandCallbackData;
};

// https://discord.com/developers/docs/interactions/slash-commands#interaction-response-object-interaction-callback-type
export enum InteractionCallbackType {
	PONG = 1,
	CHANNEL_MESSAGE_WITH_SOURCE = 4,
	DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = 5,
}

// https://discord.com/developers/docs/interactions/slash-commands#interaction-response-object-interaction-application-command-callback-data-structure
export type InteractionApplicationCommandCallbackData = {
	tts?: boolean;
	content?: string;
	embeds?: Embed[];
	allowed_mentions?: AllowedMentions;
	flags?: number;
	components?: Component[];
};

// https://discord.com/developers/docs/interactions/slash-commands#message-interaction-object-message-interaction-structure
export type MessageInteraction = {
	id: Snowflake;
	type: InteractionRequestType;
	name: string;
	user: User;
};
