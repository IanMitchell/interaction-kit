import type { BitFlags } from "bitflag-js";

export const SKUFlags = Object.freeze({
	Available: 1n << 2n,
	GuildSubscription: 1n << 7n,
	UserSubscription: 1n << 8n,
}) satisfies BitFlags;
