import { URL } from "url";
import Config from "./config";
import Client from "discord-request";
import {
	API_URL,
	InteractionApplicationCommandCallbackData,
	Snowflake,
} from "../definitions";

/**
 * https://discord.com/developers/docs/interactions/slash-commands#followup-messages
 */

// TODO: Test, Type, Document
export async function postWebhookMessage(
	interactionToken: string,
	data: InteractionApplicationCommandCallbackData,
	options: {
		headers?: Record<string, string>;
		applicationID?: Snowflake;
	} = {}
) {
	const {
		applicationID = Config.getApplicationID(),
		headers = Config.getHeaders(),
	} = options;

	const url = new URL(
		`${API_URL}/webhooks/${applicationID}/${interactionToken}`
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

// TODO: Test, Type, Document
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
		applicationID = Config.getApplicationID(),
		headers = Config.getHeaders(),
	} = options;

	const url = new URL(
		`${API_URL}/webhooks/${applicationID}/${interactionToken}/messages/${id}`
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

// TODO: Test, Type, Document
export async function deleteWebhookMessage(
	interactionToken: string,
	id: string,
	options: {
		headers?: Record<string, string>;
		applicationID?: string;
	} = {}
): Promise<boolean> {
	const {
		applicationID = Config.getApplicationID(),
		headers = Config.getHeaders(),
	} = options;

	const url = new URL(
		`${API_URL}/webhooks/${applicationID}/${interactionToken}/messages/${id}`
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

	return response.ok;
}
