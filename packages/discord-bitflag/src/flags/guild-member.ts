import type { BitFlags } from "bitflag-js";

export const GuildMemberFlags = Object.freeze({
	DidRejoin: 1n << 0n,
	CompletedOnboarding: 1n << 1n,
	BypassesVerification: 1n << 2n,
	StartedOnboarding: 1n << 3n,
	IsGuest: 1n << 4n,
	StartedHomeActions: 1n << 5n,
	CompletedHomeActions: 1n << 6n,
	AutomatedQuarantinedUsername: 1n << 7n,
	DmSettingsUpsellAcknowledged: 1n << 9n,
	AutomatedQuarantinedGuildTag: 1n << 10n,
}) satisfies BitFlags;
