import { BitField } from "bitflag-js";
import { MessageFlags } from "../flags/message.js";

export class MessageFlagsBitField extends BitField {
	static ALL = BitField.resolve(Object.values(MessageFlags));
}
