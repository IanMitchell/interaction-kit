/**
 * These type definitions come from the official Discord API docs. They should
 * be defined with references back to the documentation section.
 */

import { User } from "./users";
import type { Snowflake } from "./snowflakes";

// @see {@link https://discord.com/developers/docs/resources/channel#channel-object-channel-structure}
export type Channel = {
    id: Snowflake;
    type: ChannelType;
    guild_id?: Snowflake;
    position?: number;
    permission_overwrites?: PermissionOverwrite[];
    name?: string;
    topic?: string | null;
    nsfw?: boolean;
    last_message_id?: Snowflake | null;
    bitrate?: number;
    user_limit?: number;
    rate_limit_per_user?: number;
    recipients?: User[];
    icon?: string | null;
    owner_id?: Snowflake;
    application_id?: Snowflake;
    parent_id?: Snowflake | null;
    last_pin_timestamp?: Date | null; // TODO: validate
    rtc_region?: string | null;
    video_quality_mode?: VideoQualityMode;
    message_count?: number;
    member_count?: number;
    thread_metadata?: ThreadMetadata;
    member?: ThreadMember;
    default_auto_archive_duration?: number;
    permissions?: string;
};


// https://discord.com/developers/docs/resources/channel#allowed-mentions-object-allowed-mention-types
export enum AllowedMentionTypes {
	ROLE = "roles",
	USER = "users",
	EVERYONE = "everyone",
};

// https://discord.com/developers/docs/resources/channel#allowed-mentions-object-allowed-mentions-structure
export type AllowedMentions = {
	parse: AllowedMentionTypes[];
	roles: Snowflake[];
	users: Snowflake[];
	replied_user: boolean;
};

// https://discord.com/developers/docs/resources/channel#channel-object-channel-types
export enum ChannelType {
    GUILD_TEXT = 0,
    DM = 1,
    GUILD_VOICE = 2,
    GROUP_DM = 3,
    GUILD_CATEGORY = 4,
    GUILD_NEWS = 5,
    GUILD_STORE = 6,
    GUILD_NEWS_THREAD = 10,
    GUILD_PUBLIC_THREAD = 11,
    GUILD_PRIVATE_THREAD = 12,
    GUILD_STAGE_VOICE = 13,
};

// https://discord.com/developers/docs/resources/channel#channel-object-video-quality-modes
export enum VideoQualityMode {
    AUTO = 1,
    FULL = 2
};

// https://discord.com/developers/docs/resources/channel#thread-metadata-object
export type ThreadMetadata = {
    archived: boolean;
    auto_archive_duration: number
    archive_timestamp: Date;
    locked: boolean;
    invitable?: boolean;
};

// https://discord.com/developers/docs/resources/channel#thread-member-object-thread-member-structure
export type ThreadMember = {
    id?: Snowflake;
    user_id?: Snowflake;
    join_timestamp?: Date;
    flags: number;
};

// https://discord.com/developers/docs/resources/channel#overwrite-object-overwrite-structure
export type PermissionOverwrite = {
    id: Snowflake;
    type: 0 | 1;
    allow: string;
    deny: string;
};