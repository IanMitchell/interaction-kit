import { BitField } from "bitflag-js";
import { UserFlags } from "../flags/user.js";

export class UserFlagsBitField extends BitField {
	static ALL = BitField.resolve(Object.values(UserFlags));
}
