import type { Snowflake } from "../definitions";

export interface DiscordRecord {
	// Static
	fetch: (id: Snowflake) => DiscordRecord;

	// Instance
	save: () => DiscordRecord;
	refresh: () => DiscordRecord;
	equals: (record: DiscordRecord) => boolean;
}
