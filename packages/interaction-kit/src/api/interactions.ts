import { URL } from "url";
import Config from "./config";
import Client from "../../../discord-request/src/client";
import {
	API_URL,
	InteractionApplicationCommandCallbackData,
	Snowflake,
} from "../definitions";

/**
 * https://discord.com/developers/docs/interactions/slash-commands#followup-messages
 */

export async function postWebhookMessage(
	interactionToken: string,
	data: InteractionApplicationCommandCallbackData,
	options: {
		headers?: Record<string, string>;
		applicationID?: Snowflake;
	} = {}
) {
	const {
		applicationID = Config.applicationID,
		headers = Config.getHeaders(),
	} = options;

	const url = new URL(
		`/webhooks/${applicationID}/${interactionToken}`,
		new URL(API_URL)
	);

	return Client.post(
		url,
		{
			headers,
			body: JSON.stringify(data),
		},
		{
			route: "[GET] /webhooks/{application.id}/{interaction.token}",
			identifier: `${applicationID}${interactionToken}`,
		}
	);
}

export async function patchWebhookMessage(
	interactionToken: string,
	id: string,
	data: InteractionApplicationCommandCallbackData,
	options: {
		headers?: Record<string, string>;
		applicationID?: string;
	} = {}
) {
	const {
		applicationID = Config.applicationID,
		headers = Config.getHeaders(),
	} = options;

	const url = new URL(
		`/webhooks/${applicationID}/${interactionToken}/messages/${id}`,
		new URL(API_URL)
	);

	return Client.patch(
		url,
		{
			headers,
			body: JSON.stringify(data),
		},
		{
			route: `[PATCH] /webhooks/{application.id}/{interaction.token}/messages/${
				id === "@original" ? "@original" : "{message_id}"
			}`,
			identifier: `${applicationID}${interactionToken}`,
		}
	);
}

export async function deleteWebhookMessage(
	interactionToken: string,
	id: string,
	options: {
		headers?: Record<string, string>;
		applicationID?: string;
	} = {}
): Promise<boolean> {
	const {
		applicationID = Config.applicationID,
		headers = Config.getHeaders(),
	} = options;

	const url = new URL(
		`/webhooks/${applicationID}/${interactionToken}/messages/${id}`,
		new URL(API_URL)
	);

	const response = await Client.delete(
		url,
		{
			headers,
		},
		{
			route: `[DELETE] /webhooks/{application.id}/{interaction.token}/messages/${
				id === "@original" ? "@original" : "{message_id}"
			}`,
			identifier: `${applicationID}${interactionToken}`,
		}
	);

	// TODO: Verify this is correct
	return response.ok;
}
