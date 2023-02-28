import type { RESTGetAPIAuditLogResult } from "discord-api-types/v10";
import { Routes } from "discord-api-types/v10";
import type { Snowflake } from "discord-snowflake";
import { client } from "../client.js";

/**
 * Get the Audit Log for a Guild.
 * {@link https://discord.com/developers/docs/resources/audit-log#get-guild-audit-log | Discord Documentation}
 * @param guildId - TThe target Guild to get the Audit Log in.
 * @returns The Audit Log for the Guild.
 */
export async function getGuildAuditLog(guildId: Snowflake) {
	return client.get(
		Routes.guildAuditLog(guildId)
	) as Promise<RESTGetAPIAuditLogResult>;
}
