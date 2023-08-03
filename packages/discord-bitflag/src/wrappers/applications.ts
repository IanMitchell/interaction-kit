import { BitField } from "bitflag-js";
import { ApplicationFlags } from "discord-api-types/v10";

export class ApplicationFlagsBitField extends BitField {
	static ALL = Object.values(ApplicationFlags).reduce(
		(total, flag) => total | BigInt(flag),
		0n
	);
}
