/**
 * These type definitions come from the official Discord API docs. They should
 * be defined with references back to the documentation section.
 */

import { User } from "./users";
import { Snowflake } from "./snowflakes"

/** @link https://discord.com/developers/docs/resources/guild#guild-member-object-guild-member-structure */
export type GuildMember = {
    user?: User;
    nick?: string | null;
    avatar?: string | null;
    roles: Snowflake[];
    joined_at: Date; // TODO: validate
    premium_since?: Date | null;
    deaf: boolean;
    mute: boolean;
    pending?: boolean;
    permissions?: string;
};