import type { BitFlags } from "bitflag-js";

export const GuildMemberFlags: BitFlags = Object.freeze({
	DidRejoin: 1n << 0n,
	CompletedOnboarding: 1n << 1n,
	BypassesVerification: 1n << 2n,
	StartedOnboarding: 1n << 3n,
});
