import rest from "./instance";
import { Snowflake } from "../interfaces";
import { RESTGetAPIGuildResult, Routes } from "discord-api-types/v9";

// TODO: Test, Type, Document
export async function getGuild(
	id: Snowflake,
	options: {
		counts?: boolean;
	} = {}
) {
	const { counts = false } = options;

	return rest.get(Routes.guild(id), {
		query: new URLSearchParams({ with_counts: String(counts) }),
	}) as Promise<RESTGetAPIGuildResult>;
}
