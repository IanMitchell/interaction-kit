import { URL } from "url";
import Client from "discord-request";
import Config from "./config";
import { API_URL, Snowflake } from "../definitions";

// TODO: Test, Type, Document
export async function getGuild(
	id: Snowflake,
	options: {
		headers?: Record<string, string>;
		counts?: boolean;
	} = {}
) {
	const { headers = Config.getHeaders(), counts = false } = options;

	const url = new URL(`/guilds/${id}`, new URL(API_URL));

	if (counts) {
		url.searchParams.set("with_counts", "true");
	}

	return Client.get(
		url,
		{
			headers,
		},
		{
			route: "[GET] /guilds/{guild.id}",
			identifier: id,
		}
	);
}
