import type { UserAgent } from "discord-request";
import { Client } from "discord-request";
import pkg from "../package.json" assert { type: "json" };

export class DiscordApiClient extends Client {
	get userAgent(): UserAgent {
		return super.userAgent;
	}

	set userAgent(value: string | undefined | null) {
		let str = `discord-api ${pkg.version}`;

		if (value) {
			str += ` ${value}`;
		}

		super.userAgent = str;
	}
}

export const client = new DiscordApiClient({
	userAgent: `discord-api ${pkg.version}`,
});
