import type { BitFlags } from "bitflag-js";

export const SystemChannelFlags = Object.freeze({
	SuppressJoinNotifications: 1n << 0n,
	SuppressPremiumSubscriptions: 1n << 1n,
	SuppressGuildReminderNotifications: 1n << 2n,
	SuppressJoinNotificationReplies: 1n << 3n,
	SuppressROLE_SubscriptionPurchaseNotifications: 1n << 4n,
	SuppressROLE_SubscriptionPurchaseNotificationReplies: 1n << 5n,
}) satisfies BitFlags;
