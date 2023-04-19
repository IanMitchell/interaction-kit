import type { UserAgent } from "discord-request";
import { Client } from "discord-request";
import pkg from "../package.json" assert { type: "json" };

class DiscordWebhookClient extends Client {
	get userAgent(): UserAgent {
		return super.userAgent;
	}

	set userAgent(value: string | undefined | null) {
		let str = `discord-webhook ${pkg.version}`;

		if (value) {
			str += ` ${value}`;
		}

		super.userAgent = str;
	}
}

export const client = new DiscordWebhookClient({
	userAgent: `discord-webhook ${pkg.version}`,
});

// TODO: Accept message, embeds, files
export async function webhook(id: string, token: string) {
	// TODO: Inspect payload for kind, see if it has attachments
	// this will dictate return type

	// return client.post(Routes.webhook(id, token), {
	// 	body: {},
	// }) as Promise<unknown>;

	return null;
}
