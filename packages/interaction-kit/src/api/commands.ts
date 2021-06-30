import Client from "discord-request";
import { URL } from "url";
import { getStandardHeaders } from "./index";
import { API_URL, ApplicationCommand, Snowflake } from "../definitions";
import { Optional } from "../interfaces";

export async function getGuildApplicationCommands({
	applicationID,
	guildID,
}: {
	applicationID: Snowflake;
	guildID: Snowflake;
}): Promise<ApplicationCommand[]> {
	const url = new URL(
		`/applications/${applicationID}/guilds/${guildID}/commands`,
		new URL(API_URL)
	);

	const response = Client.get(
		url,
		{
			headers: getStandardHeaders(),
		},
		{
			route: "[GET] /applications/{application.id}/guilds/{guild.id}/commands",
			identifier: guildID,
		}
	);

	return response.json() as Promise<ApplicationCommand[]>;
}

export async function getGlobalApplicationCommands() {
	return Promise.resolve();
}

export async function postGuildApplicationCommand({
	applicationID,
	guildID,
	command,
}: {
	applicationID: Snowflake;
	guildID: Snowflake;
	command: Omit<ApplicationCommand, "id" | "application_id">;
}) {
	const url = new URL(
		`/applications/${applicationID}/guilds/${guildID}/commands`,
		new URL(API_URL)
	);

	const response = Client.post(
		url,
		{
			headers: getStandardHeaders(),
			body: JSON.stringify(command),
		},
		{
			route: "[POST] /applications/{application.id}/guilds/{guild.id}/commands",
			identifier: guildID,
		}
	);

	return response.json() as Promise<ApplicationCommand>;
}

export async function putGuildApplicationCommands({
	applicationID,
	guildID,
	commands,
}: {
	applicationID: Snowflake;
	guildID: Snowflake;
	commands: ApplicationCommand[];
}) {
	const url = new URL(
		`/applications/${applicationID}/guilds/${guildID}/commands`,
		new URL(API_URL)
	);

	const response = Client.put(
		url,
		{
			headers: getStandardHeaders(),
			body: JSON.stringify(commands),
		},
		{
			route: "[PUT] /applications/{application.id}/guilds/{guild.id}/commands",
			identifier: guildID,
		}
	);

	return response.json() as Promise<ApplicationCommand>;
}

export async function patchGuildApplicationCommand({
	applicationID,
	guildID,
	command,
}: {
	applicationID: string;
	guildID: string;
	command: Optional<
		ApplicationCommand,
		"name" | "description" | "options" | "default_permission"
	>;
}) {
	const url = new URL(
		`/applications/${applicationID}/guilds/${guildID}/commands`,
		new URL(API_URL)
	);

	const response = Client.patch(
		url,
		{
			headers: getStandardHeaders(),
			body: JSON.stringify(command),
		},
		{
			route:
				"[PATCH] /applications/{application.id}/guilds/{guild.id}/commands",
			identifier: guildID,
		}
	);

	return response.json() as Promise<ApplicationCommand>;
}

export async function deleteGuildApplicationCommand({
	applicationID,
	guildID,
	commandID,
}: {
	applicationID: Snowflake;
	guildID: Snowflake;
	commandID: Snowflake;
}) {
	const url = new URL(
		`/applications/${applicationID}/guilds/${guildID}/commands/${commandID}`,
		new URL(API_URL)
	);

	const response = await Client.delete(
		url,
		{
			headers: getStandardHeaders(),
		},
		{
			route:
				"[DELETE] /applications/{application.id}/guilds/{guild.id}/commands/{command.id}",
			identifier: guildID,
		}
	);

	return response.ok;
}
