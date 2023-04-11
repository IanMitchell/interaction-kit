import { Client } from "discord-request";
import pkg from "../package.json" assert { type: "json" };

export class DiscordApiClient extends Client {
	get userAgent() {
		return super.userAgent;
	}

	set userAgent(value: string) {
		super.userAgent = `${value}, discord-api ${pkg.version}`;
	}
}

export const client = new DiscordApiClient({
	userAgent: `discord-api ${pkg.version}`,
});
