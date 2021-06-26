import Client from "discord-request";
import { URL } from "url";
import { getStandardHeaders } from "./index";
import { API_URL, ApplicationCommand, Snowflake } from "../definitions";

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

	return Client.get(
		url,
		{
			headers: getStandardHeaders(),
		},
		{
			route: "[GET] /applications/{application.id}/guilds/{guild.id}/commands",
			identifier: guildID,
		}
	) as Promise<ApplicationCommand[]>;
	// TODO: Is there a better way than `as Promise<>`?
}

export async function getGlobalApplicationCommands() {
	return Promise.resolve();
}

export async function postGuildApplicationCommand() {
	return Promise.resolve();
}

export async function patchGuildApplicationCommands() {
	return Promise.resolve();
}

export async function patchGuildApplicationCommand({
	applicationID,
	commandID,
	command,
}: {
	applicationID: string;
	commandID: string;
	command: ApplicationCommand;
}) {
	return Promise.resolve({ applicationID, commandID, command });
}
