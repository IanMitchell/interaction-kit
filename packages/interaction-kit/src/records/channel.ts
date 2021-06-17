import { Snowflake } from "src/definitions";

interface DiscordRecord {
	fetch: (id: Snowflake) => DiscordRecord;
}
