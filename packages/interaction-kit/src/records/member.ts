import { DiscordRecord } from "./discord-record";

export default class Member implements DiscordRecord {
	constructor(opts) {
		this.opts = opts;
	}

	static fetch(id: Snowflake): Member {
		return new Member();
	}
}
