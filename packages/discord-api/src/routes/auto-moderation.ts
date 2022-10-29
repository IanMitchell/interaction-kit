import type {
	RESTDeleteAPIAutoModerationRuleResult,
	RESTGetAPIAutoModerationRuleResult,
	RESTGetAPIAutoModerationRulesResult,
	RESTPatchAPIAutoModerationRuleResult,
	RESTPostAPIAutoModerationRuleJSONBody,
	RESTPostAPIAutoModerationRuleResult,
} from "discord-api-types/v10";
import { Routes } from "discord-api-types/v10";
import type { Snowflake } from "discord-snowflake";
import { client } from "../client.js";
import { getAuditLogHeaders } from "../headers/audit-log.js";

/**
 * Retrieves a list of all Auto Moderation Rules.
 * {@link https://discord.com/developers/docs/resources/auto-moderation#list-auto-moderation-rules-for-guild | Discord Documentation}
 * @param guildId - The target Guild to view the Rules in.
 * @returns A list of all the Auto Moderation Rules.
 */
export async function getAutoModerationRules(guildId: Snowflake) {
	return client.get(
		Routes.guildAutoModerationRules(guildId)
	) as Promise<RESTGetAPIAutoModerationRulesResult>;
}

/**
 * Retrieves an Auto Moderation Rule.
 * {@link https://discord.com/developers/docs/resources/auto-moderation#get-auto-moderation-rule | Discord Documentation}
 * @param guildId - The target Guild to get the Rule in.
 * @param ruleId - The target Rule to view.
 * @returns The Auto Moderation Rule.
 */
export async function getAutoModerationRule(
	guildId: Snowflake,
	ruleId: Snowflake
) {
	return client.get(
		Routes.guildAutoModerationRule(guildId, ruleId)
	) as Promise<RESTGetAPIAutoModerationRuleResult>;
}

/**
 * Creates an Auto Moderation Rule.
 * {@link https://discord.com/developers/docs/resources/auto-moderation#create-auto-moderation-rule | Discord Documentation}
 * @param guildId - The target Guild to create the Rule in.
 * @param data - The data to use for the new Rule.
 * @param auditLogReason - An optional Audit Log entry to record this action under.
 * @returns The created Auto Moderation Rule.
 */
export async function createAutoModerationRule(
	guildId: Snowflake,
	data: RESTPostAPIAutoModerationRuleJSONBody,
	auditLogReason?: string
) {
	return client.post(Routes.guildAutoModerationRules(guildId), {
		body: data,
		headers: getAuditLogHeaders(auditLogReason),
	}) as Promise<RESTPostAPIAutoModerationRuleResult>;
}

/**
 * Updates an Auto Moderation Rule.
 * {@link https://discord.com/developers/docs/resources/auto-moderation#modify-auto-moderation-rule | Discord Documentation}
 * @param guildId - The target Guild to delete the Rule from.
 * @param ruleId - The target Rule to update.
 * @param data - The new data to use for the Rule.
 * @param auditLogReason - An optional Audit Log entry to record this action under.
 * @returns The updated Auto Moderation Rule.
 */
export async function updateAutoModerationRule(
	guildId: Snowflake,
	ruleId: Snowflake,
	data: RESTPostAPIAutoModerationRuleJSONBody,
	auditLogReason?: string
) {
	return client.patch(Routes.guildAutoModerationRule(guildId, ruleId), {
		body: data,
		headers: getAuditLogHeaders(auditLogReason),
	}) as Promise<RESTPatchAPIAutoModerationRuleResult>;
}

/**
 * Deletes an Auto Moderation Rule.
 * {@link https://discord.com/developers/docs/resources/auto-moderation#delete-auto-moderation-rule | Discord Documentation}
 * @param guildId - The target Guild to delete the Rule from.
 * @param ruleId - The target Rule to delete.
 * @param auditLogReason - An optional Audit Log entry to record this action under.
 */
export async function deleteAutoModerationRule(
	guildId: Snowflake,
	ruleId: Snowflake,
	auditLogReason?: string
) {
	return client.delete(Routes.guildAutoModerationRule(guildId, ruleId), {
		headers: getAuditLogHeaders(auditLogReason),
	}) as Promise<RESTDeleteAPIAutoModerationRuleResult>;
}
