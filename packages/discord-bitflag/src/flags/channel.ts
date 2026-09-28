import type { BitFlags } from "bitflag-js";

export const ChannelFlags = Object.freeze({
	Pinned: 1n << 1n,
	RequireTag: 1n << 4n,
	HideMediaDownloadOptions: 1n << 15n,
	ChannelObfuscated: 1n << 17n,
	IsSpoilerChannel: 1n << 21n,
}) satisfies BitFlags;
