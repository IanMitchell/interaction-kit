import { BitField } from "bitflag-js";
import { GuildMemberFlags } from "../flags/guild-member.js";

export class GuildMemberFlagsBitField extends BitField {
	static ALL = BitField.resolve(Object.values(GuildMemberFlags));
}
