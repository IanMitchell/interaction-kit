import Client from "../../packages/discord-request/src/client";

export function getGuild(id: string, { counts = false }) {
	return Client.post(
		`/guilds/${id}`,
		{},
		{
			route: "[GET] /guilds/:guild.id",
			identifier: id,
		}
	);
}
