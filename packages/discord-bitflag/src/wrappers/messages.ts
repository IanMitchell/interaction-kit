import { BitField } from "bitflag-js";
import { MessageFlags } from "../flags/message.js";

export class MessageFlagsBitField extends BitField {
	static ALL = Object.values(MessageFlags).reduce(
		(total, flag) => total | flag,
		0n
	);
}
