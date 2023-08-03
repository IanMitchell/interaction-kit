import { BitField } from "bitflag-js";
import { UserFlags } from "../flags/user.js";

export class ApplicationFlagsBitField extends BitField {
	static ALL = Object.values(UserFlags).reduce(
		(total, flag) => total | BigInt(flag),
		0n
	);
}
