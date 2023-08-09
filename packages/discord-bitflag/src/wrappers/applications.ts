import { BitField } from "bitflag-js";
import { ApplicationFlags } from "../flags/application.js";

export class ApplicationFlagsBitField extends BitField {
	static ALL = BitField.resolve(Object.values(ApplicationFlags));
}
