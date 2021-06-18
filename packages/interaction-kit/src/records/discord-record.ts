import type { Snowflake } from "src/definitions";

export interface DiscordRecord {
	fetch: (id: Snowflake) => DiscordRecord;
	save: () => DiscordRecord;
	refresh: () => DiscordRecord;
	equals: (record: DiscordRecord) => boolean;
}
