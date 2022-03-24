import type { Snowflake } from "discord-snowflake";

export interface DiscordRecord {
	// Static
	fetch: (id: Snowflake) => DiscordRecord;

	// Instance
	save: () => DiscordRecord;
	refresh: () => DiscordRecord;
	equals: (record: DiscordRecord) => boolean;
}
