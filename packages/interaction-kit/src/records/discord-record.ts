import type { Snowflake } from "../interfaces";

export interface DiscordRecord {
	// Static
	fetch: (id: Snowflake) => DiscordRecord;

	// Instance
	save: () => DiscordRecord;
	refresh: () => DiscordRecord;
	equals: (record: DiscordRecord) => boolean;
}
