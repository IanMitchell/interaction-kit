import { getStandardHeaders } from ".";
import Client from "../../../discord-request/src/client";
import {
	API_URL,
	InteractionApplicationCommandCallbackData,
} from "../definitions";

/**
 * https://discord.com/developers/docs/interactions/slash-commands#followup-messages
 */

export async function postWebhookMessage({
	applicationID,
	interactionToken,
	data,
}: {
	applicationID: string;
	interactionToken: string;
	data: InteractionApplicationCommandCallbackData;
}) {
	const url = new URL(
		`/webhooks/${applicationID}/${interactionToken}`,
		new URL(API_URL)
	);

	return Client.post(
		url,
		{
			headers: getStandardHeaders(),
			body: JSON.stringify(data),
		},
		{
			route: "[GET] /webhooks/{application.id}/{interaction.token}",
			identifier: `${applicationID}${interactionToken}`,
		}
	);
}

export function patchWebhookMessage({
	applicationID,
	interactionToken,
	id,
	data,
}: {
	applicationID: string;
	interactionToken: string;
	id: string;
	data: InteractionApplicationCommandCallbackData;
}) {
	const url = new URL(
		`/webhooks/${applicationID}/${interactionToken}/messages/${id}`,
		new URL(API_URL)
	);

	return Client.patch(
		url,
		{
			headers: getStandardHeaders(),
			body: JSON.stringify(data),
		},
		{
			route: `[PATCH] /webhooks/{application.id}/{interaction.token}/messages/${
				id === "@original" ? "@original" : "<message_id>"
			}`,
			identifier: `${applicationID}${interactionToken}`,
		}
	);
}

export function deleteWebhookMessage({
	applicationID,
	interactionToken,
	id,
}: {
	applicationID: string;
	interactionToken: string;
	id: string;
}) {
	const url = new URL(
		`/webhooks/${applicationID}/${interactionToken}/messages/${id}`,
		new URL(API_URL)
	);

	return Client.delete(
		url,
		{
			headers: getStandardHeaders(),
		},
		{
			route: `[DELETE] /webhooks/{application.id}/{interaction.token}/messages/${
				id === "@original" ? "@original" : "<message_id>"
			}`,
			identifier: `${applicationID}${interactionToken}`,
		}
	);
}
