/**
 * These type definitions come from the official Discord API docs. They should
 * be defined with references back to the documentation section.
 */

import { Snowflake } from "./snowflakes";

// https://discord.com/developers/docs/topics/permissions#role-object-role-structure
export type Role = {
    id: Snowflake;
    name: string;
    color: number;
    hoist: boolean;
    icon?: string | null;
    unicode_emoji?: string | null;
    position: number;
    permissions: string;
    managed: boolean;
    mentionable: boolean;
    tags?: RoleTags; // TODO: validate
};

// https://discord.com/developers/docs/topics/permissions#role-object-role-tags-structure
export type RoleTags = {
    bot_id?: Snowflake;
    integration_id?: Snowflake;
    premium_subscriber?: null;
};