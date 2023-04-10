import { Client } from "discord-request";
import pkg from "../package.json" assert { type: "json" };

class DiscordWebhookClient extends Client {
	get userAgent() {
		return super.userAgent;
	}

	set userAgent(value: string) {
		super.userAgent = `${value}, discord-webhook ${pkg.version}`;
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
