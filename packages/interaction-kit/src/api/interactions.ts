import Client from "../../packages/discord-request/src";

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
	data: unknown;
}) {
	return Client.post(
		`/webhooks/${applicationID}/${interactionToken}`,
		{
			data,
		},
		{
			route: "[GET] /webhooks/:application.id/:interaction.token",
			identifier: `${applicationID}${interactionToken}`,
		}
	);
}

export function deleteWebhookMessage();

export function patchWebhookMessage();
