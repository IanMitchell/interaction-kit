import { BitField } from "bitflag-js";
import { GuildMemberFlags } from "../flags/guild-member.js";

export class GuildMemberFlagsBitField extends BitField {
	static ALL = Object.values(GuildMemberFlags).reduce(
		(total, flag) => total | flag,
		0n
	);
}
