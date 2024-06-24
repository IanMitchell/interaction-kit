import type { BitFlagResolvable } from "bitflag-js";
import { BitField } from "bitflag-js";
import { PermissionFlags } from "../flags/permissions.js";

export class PermissionsBitField extends BitField {
	static ALL = BitField.resolve(Object.values(PermissionFlags));

	has(...flags: BitFlagResolvable[]) {
		return super.has(flags) || super.has(PermissionFlags.Administrator);
	}

	hasWithoutAdmin(...flags: BitFlagResolvable[]) {
		return super.has(flags);
	}
}
