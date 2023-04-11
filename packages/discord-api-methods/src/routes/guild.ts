import type { RESTGetAPIGuildResult } from "discord-api-types/v10";
import { Routes } from "discord-api-types/v10";
import type { Snowflake } from "discord-snowflake";
import { client } from "../client.js";

// TODO: Test, Document
export async function getGuild(
	id: Snowflake,
	options: {
		counts?: boolean;
	} = {}
) {
	const { counts = false } = options;

	return client.get(Routes.guild(id), {
		query: new URLSearchParams({ with_counts: String(counts) }),
	}) as Promise<RESTGetAPIGuildResult>;
}
