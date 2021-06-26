import { URL } from "url";
import Client from "discord-request";
import { API_URL } from "../definitions";
import { getStandardHeaders } from "./index";

export async function getGuild(id: string, { counts = false }) {
	const url = new URL(`/guilds/${id}`, new URL(API_URL));

	if (counts) {
		url.searchParams.set("with_counts", "true");
	}

	return Client.get(
		url,
		{
			headers: getStandardHeaders(),
		},
		{
			route: "[GET] /guilds/{guild.id}",
			identifier: id,
		}
	);
}
