import { BitField } from "bitflag-js";
import { UserFlags } from "../flags/user.js";

export class UserFlagsBitField extends BitField {
	static ALL = Object.values(UserFlags).reduce(
		(total, flag) => total | flag,
		0n
	);
}
