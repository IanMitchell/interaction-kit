import type {
	RESTDeleteAPIChannelResult,
	RESTGetAPIChannelResult,
	RESTPatchAPIChannelJSONBody,
	RESTPatchAPIChannelResult,
} from "discord-api-types/v10";
import { Routes } from "discord-api-types/v10";
import type { Snowflake } from "discord-snowflake";
import { client } from "../client.js";
import { getAuditLogHeaders } from "../headers/audit-log.js";

/**
 * Get a Channel.
 * {@link https://discord.com/developers/docs/resources/channel#get-channel | Discord Documentation}
 * @param channelId - The target Channel to get.
 * @returns The Channel.
 */
export async function getChannel(channelId: Snowflake) {
	return client.get(
		Routes.channel(channelId)
	) as Promise<RESTGetAPIChannelResult>;
}

/**
 * Updates a Channel.
 * {@link https://discord.com/developers/docs/resources/channel#modify-channel | Discord Documentation}
 * @param channelId - The target Channel to update.
 * @param data - The new data to use for the Channel.
 * @param auditLogReason - An optional Audit Log entry to record this action under.
 * @returns The updated Channel.
 */
export async function updateChannel(
	channelId: Snowflake,
	data: RESTPatchAPIChannelJSONBody,
	auditLogReason?: string
) {
	return client.patch(Routes.channel(channelId), {
		body: data,
		headers: getAuditLogHeaders(auditLogReason),
	}) as Promise<RESTPatchAPIChannelResult>;
}

/**
 * Deletes a channel or closes a private message.
 * @param channelId - The target Channel to delete.
 * @param auditLogReason - An optional Audit Log entry to record this action under.
 * @returns The deleted Channel.
 */
export async function deleteChannel(
	channelId: Snowflake,
	auditLogReason?: string
) {
	return client.delete(Routes.channel(channelId), {
		headers: getAuditLogHeaders(auditLogReason),
	}) as Promise<RESTDeleteAPIChannelResult>;
}
