/**
 * These type definitions come from the official Discord API docs. They should
 * be defined with references back to the documentation section.
 */

import type { Snowflake } from "./snowflakes";

// FIXME: Add Channel types
export type Channel = Record<string, unknown>;

// https://discord.com/developers/docs/resources/channel#allowed-mentions-object-allowed-mention-types
export enum AllowedMentionTypes {
	ROLE = "roles",
	USER = "users",
	EVERYONE = "everyone",
}

// https://discord.com/developers/docs/resources/channel#allowed-mentions-object-allowed-mentions-structure
export type AllowedMentions = {
	parse: AllowedMentionTypes[];
	roles: Snowflake[];
	users: Snowflake[];
	replied_user: boolean;
};
