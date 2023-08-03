import type { BitFlagResolvable } from "bitflag-js";
import { BitField } from "bitflag-js";
import { PermissionFlags } from "../flags/permissions.js";

export class PermissionsBitField extends BitField {
	static ALL = Object.values(PermissionFlags).reduce(
		(total, permission) => total | permission,
		0n
	);

	has(...flags: BitFlagResolvable[]) {
		return super.has(flags, PermissionFlags.Administrator);
	}

	hasWithoutAdmin(...flags: BitFlagResolvable[]) {
		return super.has(flags);
	}
}
