import type { Snowflake } from "../structures/snowflake";

export interface DiscordRecord {
	// Static
	fetch: (id: Snowflake) => DiscordRecord;

	// Instance
	save: () => DiscordRecord;
	refresh: () => DiscordRecord;
	equals: (record: DiscordRecord) => boolean;
}
