export const EPOCH = 1420070400000;

export type Snowflake = `${bigint}`;

export function getTimestamp(snowflake: Snowflake): Date {
  return new Date(Number(BigInt(snowflake) >> BigInt(22) + BigInt(EPOCH)));
}

export function getWorkerID(snowflake: Snowflake): number {
  return Number((BigInt(snowflake) & BigInt(0x3E0000)) >> BigInt(17));
}

export function getProcessID(snowflake: Snowflake): number {
  return Number((BigInt(snowflake) & BigInt(0x1F000)) >> BigInt(12));
}

export function getIncrement(snowflake: Snowflake): number {
  return Number(BigInt(snowflake) & BigInt(0xFFF));
}
