import { BitField } from "bitflag-js";
import { ChannelFlags } from "../flags/channel.js";

export class ChannelFlagsBitField extends BitField {
	static ALL = Object.values(ChannelFlags).reduce(
		(total, flag) => total | BigInt(flag),
		0n
	);
}
