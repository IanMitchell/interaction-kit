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
import { Component, ComponentType, SelectOption } from "./components";
import { Message } from "./messages";
import { ChannelType } from "./channels"
import { PartialAttachment } from "./attachment"

/** @link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure */
export type ApplicationCommand = {
	id: Snowflake;
	type?: ApplicationCommandType;
	application_id: Snowflake;
	guild_id?: Snowflake;
	name: string;
	description?: string;
	options?: ApplicationCommandOption[];
	default_permission?: boolean;
	version: Snowflake;
};

/** @link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types */
export enum ApplicationCommandType {
	CHAT_INPUT = 1,
	USER = 2,
	MESSAGE = 3,
}

/** @link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure */
export type ApplicationCommandOption = {
	type: ApplicationCommandOptionType;
	name: string;
	description: string;
	required?: boolean;
	choices?: ApplicationCommandOptionChoice[];
	options?: ApplicationCommandOption[];
	channel_types?: ChannelType[];
	min_value?: number;
	max_value?: number;
	autocomplete?: boolean;
};

/** @link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type */
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
	NUMBER = 10
}

/** @link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-choice-structure */
export type ApplicationCommandOptionChoice = {
	name: string;
	value: string | number;
};

/** @link https://discord.com/developers/docs/interactions/application-commands#application-command-permissions-object */
export type GuildApplicationCommandPermissions = {
	id: Snowflake;
	application_id: Snowflake;
	guild_id: Snowflake;
	permissions: ApplicationCommandPermissions[];
};

/** @link https://discord.com/developers/docs/interactions/application-commands#application-command-permissions-object-application-command-permissions-structure */
export type ApplicationCommandPermissions = {
	id: Snowflake;
	type: ApplicationCommandPermissionType;
	permission: boolean;
};

/** @link https://discord.com/developers/docs/interactions/application-commands#application-command-permissions-object-application-command-permission-type */
export enum ApplicationCommandPermissionType {
	ROLE = 1,
	USER = 2,
}

/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-structure */
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

/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-type */
export enum InteractionRequestType {
	PING = 1,
	APPLICATION_COMMAND = 2,
	MESSAGE_COMPONENT = 3,
	APPLICATION_COMMAND_AUTOCOMPLETE = 4
}

/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-data-structure */
export type ApplicationCommandInteractionData = {
	id: Snowflake;
	type: ApplicationCommandType;
	name: string;
	resolved?: ApplicationCommandInteractionDataResolved;
	options?: ApplicationCommandInteractionDataOption[];
	custom_id?: string;
	component_type?: ComponentType;
	target_id?: Snowflake;
	values?: Array<SelectOption["value"]>;
};

/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-resolved-data-structure */
export type ApplicationCommandInteractionDataResolved = {
	users?: Record<Snowflake, User>;
	members?: Record<Snowflake, Omit<GuildMember, "user" | "deaf" | "mute">>;
	roles?: Record<Snowflake, Role>;
	channels?: Record<
		Snowflake,
		Pick<Channel, "id" | "name" | "type" | "permissions">
	>;
	messages?: Record<Snowflake, Message>;
};

/** @link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-interaction-data-option-structure */
export type ApplicationCommandInteractionDataOption = {
	name: string;
	type: ApplicationCommandOptionType;
	value?: ApplicationCommandOptionType;
	options?: ApplicationCommandInteractionDataOption[];
	focused?: boolean;
};

/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-response-structure */
// TODO: Check?
export type InteractionResponse = {
	type: InteractionCallbackType;
	data?: InteractionApplicationCommandCallbackData;
};

/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-type */
export enum InteractionCallbackType {
	PONG = 1,
	CHANNEL_MESSAGE_WITH_SOURCE = 4,
	DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = 5,
	DEFERRED_UPDATE_MESSAGE = 6,
	UPDATE_MESSAGE = 7,
	APPLICATION_COMMAND_AUTOCOMPLETE_RESULT = 8
}

/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-messages */
export type InteractionApplicationCommandCallbackData = {
	tts?: boolean;
	content?: string;
	embeds?: Embed[];
	allowed_mentions?: AllowedMentions;
	flags?: InteractionCallbackDataFlags;
	components?: Component[];
	attachments?: PartialAttachment[];
};

/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-flags */
export enum InteractionCallbackDataFlags {
	EPHEMERAL = 1 << 6
}

/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#message-interaction-object-message-interaction-structure */
export type MessageInteraction = {
	id: Snowflake;
	type: InteractionRequestType;
	name: string;
	user: User;
};

/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-autocomplete */
export type InteractionResponseObjectAutocomplete = {
	choices: ApplicationCommandOptionChoice[]
}
