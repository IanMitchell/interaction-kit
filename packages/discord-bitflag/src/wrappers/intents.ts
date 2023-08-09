import { BitField } from "bitflag-js";
import { IntentFlags } from "../flags/intents.js";

export class IntentFlagsBitField extends BitField {
	static ALL = BitField.resolve(Object.values(IntentFlags));
}
