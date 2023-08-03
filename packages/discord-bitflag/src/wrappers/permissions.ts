import type { BitFlagResolvable } from "bitflag-js";
import { BitField } from "bitflag-js";
import { PermissionFlagsBits } from "discord-api-types/v10";

export class PermissionsBitField extends BitField {
	static ALL = Object.values(PermissionFlagsBits).reduce(
		(total, permission) => total | permission,
		0n
	);

	has(...flags: BitFlagResolvable[]) {
		return super.has(flags, PermissionFlagsBits.Administrator);
	}

	hasWithoutAdmin(...flags: BitFlagResolvable[]) {
		return super.has(flags);
	}
}
