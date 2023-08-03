import { BitField } from "bitflag-js";
import { ApplicationFlags } from "../flags/application.js";

export class ApplicationFlagsBitField extends BitField {
	static ALL = Object.values(ApplicationFlags).reduce(
		(total, flag) => total | flag,
		0n
	);
}
