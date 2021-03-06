/**
 * Snowflake structure is defined here:
 * https://discord.com/developers/docs/reference#snowflakes-snowflake-id-format-structure-left-to-right
 */

export type Snowflake = `${bigint}`;

export const EPOCH = 1420070400000n;

export function isSnowflake(id: string): id is Snowflake {
	return BigInt(id).toString() === id;
}

export function getTimestamp(snowflake: Snowflake) {
	return Number((BigInt(snowflake) >> BigInt(22)) + EPOCH);
}

export function getDate(snowflake: Snowflake) {
	return new Date(getTimestamp(snowflake));
}

export function getWorkerId(snowflake: Snowflake) {
	return Number((BigInt(snowflake) & BigInt(0x3e0000)) >> BigInt(17));
}

export function getProcessId(snowflake: Snowflake) {
	return Number((BigInt(snowflake) & BigInt(0x1f000)) >> BigInt(12));
}

export function getIncrement(snowflake: Snowflake) {
	return Number(BigInt(snowflake) & BigInt(0xfff));
}

export function parse(snowflake: Snowflake) {
	return {
		timestamp: getTimestamp(snowflake),
		workerId: getWorkerId(snowflake),
		processId: getProcessId(snowflake),
		increment: getIncrement(snowflake),
	};
}
