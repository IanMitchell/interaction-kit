import type {
	RESTPostAPIChannelWebhookJSONBody,
	RESTPostAPIChannelWebhookResult,
} from "discord-api-types/v10";
import { Routes } from "discord-api-types/v10";
import type { Snowflake } from "discord-snowflake";
import { client } from "../client.js";

/**
 * Creates a Channel Webhook
 * @link https://discord.com/developers/docs/resources/webhook#create-webhook
 * @param channelId The Channel to create the webhook in
 * @param data The Webhook name and avatar
 * @param auditLogReason An optional entry to add to the audit log
 * @returns The created Webhook
 */
export async function createWebhook(
	channelId: Snowflake,
	data: RESTPostAPIChannelWebhookJSONBody,
	auditLogReason?: string
) {
	const headers = new Headers();

	if (auditLogReason != null) {
		headers.set("X-Audit-Log-Reason", auditLogReason);
	}

	return client.post(Routes.channelWebhooks(channelId), {
		body: data,
		headers,
	}) as Promise<RESTPostAPIChannelWebhookResult>;
}
