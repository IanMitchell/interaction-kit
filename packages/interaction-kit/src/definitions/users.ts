/**
 * These type definitions come from the official Discord API docs. They should
 * be defined with references back to the documentation section.
 */

import { Snowflake } from "./snowflakes";

/** @link https://discord.com/developers/docs/resources/user#user-object-user-structure */
export type User = {
    id: Snowflake;
    username: string;
    discriminator: string;
    avatar: string | null;
    bot?: boolean;
    system?: boolean;
    mfa_enabled?: boolean;
    banner?: string | null;
    accent_color?: number | null;
    locale?: string;
    verified?: boolean;
    email?: string | null;
    flags?: number;
    premium_type?: number;
    public_flags?: number;
};

/** @link https://discord.com/developers/docs/resources/user#user-object-user-flags */
// TODO: implement this
export enum UserFlags {}
