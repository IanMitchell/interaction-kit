/**
 * These type definitions come from the official Discord API docs. They should
 * be defined with references back to the documentation section.
 */

import { Snowflake } from "./snowflakes";
import { Emoji } from "./emoji";
import { Role } from "./roles";
import { Sticker } from "./stickers";

/** @link https://discord.com/developers/docs/resources/guild#guild-object-guild-structure */
export type Guild = {
	id: Snowflake;
	name: string;
	icon?: string | null;
	icon_hash?: string | null;
	splash: string | null;
	discovery_splash: string | null;
	owner_id: Snowflake;
	region?: string | null;
	afk_channel_id: Snowflake | null;
	afk_timeout: number;
	widget_enabled?: boolean;
	widget_channel_id?: string | null;
	verification_level: VerificationLevel;
	default_message_notifications: DefaultMessageNotificationLevel;
	explicit_content_filter: ExplicitContentFilterLevel;
	roles: Role[];
	emojis: Emoji[];
	features: string[];
	mfa_level: MFALevel;
	application_id: string | null;
	system_channel_id: string | null;
	system_channel_flags: number;
	rules_channel_id: string | null;
	max_presences?: number | null;
	max_members?: number;
	vanity_url_code: string | null;
	description: string | null;
	banner: string | null;
	premium_tier: number;
	premium_subscription_count?: number;
	preferred_locale: string;
	public_updates_channel_id: string | null;
	max_video_channel_users?: number;
	approximate_member_count?: number;
	approximate_presence_count?: number;
	welcome_screen?: WelcomeScreen;
	nsfw_level: number;
	stickers?: Sticker[];
};

/** @link https://discord.com/developers/docs/resources/guild#welcome-screen-object-welcome-screen-structure */
export type WelcomeScreen = {
	description: string | null;
	welcome_channels: WelcomeScreenChannel[];
};

/** @link https://discord.com/developers/docs/resources/guild#welcome-screen-object-welcome-screen-channel-structure */
export type WelcomeScreenChannel = {
	channel_id: Snowflake;
	description: string;
	emoji_id: Snowflake | null;
	emoji_name: string | null;
};

/** @link https://discord.com/developers/docs/resources/guild#guild-object-verification-level */
export enum VerificationLevel {
	NONE = 0,
	LOW = 1,
	MEDIUM = 2,
	HIGH = 3,
	VERY_HIGH = 4,
}

/** @link https://discord.com/developers/docs/resources/guild#guild-object-default-message-notification-level */
export enum DefaultMessageNotificationLevel {
	ALL_MESSAGES = 0,
	ONLY_MENTIONS = 1,
}

/** @link https://discord.com/developers/docs/resources/guild#guild-object-explicit-content-filter-level */
export enum ExplicitContentFilterLevel {
	DISABLED = 0,
	MEMBERS_WITHOUT_ROLES = 1,
	ALL_MEMBERS = 2,
}

/** @link https://discord.com/developers/docs/resources/guild#guild-object-mfa-level */
export enum MFALevel {
	NONE = 0,
	ENABLED = 1,
}
