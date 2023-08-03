import { BitField } from "bitflag-js";
import { IntentFlags } from "../flags/intents.js";

export class IntentFlagsBitField extends BitField {
	static ALL = Object.values(IntentFlags).reduce(
		(total, flag) => total | flag,
		0n
	);
}
