import { BitField } from "bitflag-js";
import { ChannelFlags } from "../flags/channel.js";

export class ChannelFlagsBitField extends BitField {
	static ALL = BitField.resolve(Object.values(ChannelFlags));
}
