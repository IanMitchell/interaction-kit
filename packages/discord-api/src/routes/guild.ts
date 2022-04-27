import type { Snowflake } from "discord-snowflake";
import { RESTGetAPIGuildResult, Routes } from "discord-api-types/v9";
import client from "../client";

// TODO: Test, Type, Document
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
