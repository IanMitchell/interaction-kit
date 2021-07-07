import Client from "discord-request";
import { URL } from "url";
import Config from "./config";
import { API_URL, ApplicationCommand, Snowflake } from "../definitions";
import { Optional } from "../interfaces";

export async function getGlobalApplicationCommands() {
	return Promise.resolve();
}

export async function getGuildApplicationCommands(
	guildID: Snowflake,
	options: {
		headers?: Record<string, string>;
		applicationID?: Snowflake;
	}
): Promise<ApplicationCommand[]> {
	const {
		applicationID = Config.applicationID,
		headers = Config.getHeaders(),
	} = options;

	const url = new URL(
		`/applications/${applicationID}/guilds/${guildID}/commands`,
		new URL(API_URL)
	);

	const response = await Client.get(
		url,
		{
			headers,
		},
		{
			route: "[GET] /applications/{application.id}/guilds/{guild.id}/commands",
			identifier: guildID,
		}
	);

	return response.json() as Promise<ApplicationCommand[]>;
}

export async function postGuildApplicationCommand(
	guildID: Snowflake,
	command: Omit<ApplicationCommand, "id" | "application_id">,
	options: {
		headers?: Record<string, string>;
		applicationID?: Snowflake;
	}
) {
	const {
		applicationID = Config.applicationID,
		headers = Config.getHeaders(),
	} = options;

	const url = new URL(
		`/applications/${applicationID}/guilds/${guildID}/commands`,
		new URL(API_URL)
	);

	const response = await Client.post(
		url,
		{
			headers,
			body: JSON.stringify(command),
		},
		{
			route: "[POST] /applications/{application.id}/guilds/{guild.id}/commands",
			identifier: guildID,
		}
	);

	return response.json() as Promise<ApplicationCommand>;
}

export async function putGuildApplicationCommands(
	guildID: Snowflake,
	commands: ApplicationCommand[],
	options: {
		headers?: Record<string, string>;
		applicationID?: Snowflake;
	}
) {
	const {
		applicationID = Config.applicationID,
		headers = Config.getHeaders(),
	} = options;

	const url = new URL(
		`/applications/${applicationID}/guilds/${guildID}/commands`,
		new URL(API_URL)
	);

	const response = await Client.put(
		url,
		{
			headers,
			body: JSON.stringify(commands),
		},
		{
			route: "[PUT] /applications/{application.id}/guilds/{guild.id}/commands",
			identifier: guildID,
		}
	);

	return response.json() as Promise<ApplicationCommand>;
}

export async function patchGuildApplicationCommand(
	guildID: Snowflake,
	command: Optional<
		ApplicationCommand,
		"name" | "description" | "options" | "default_permission"
	>,
	options: {
		headers?: Record<string, string>;
		applicationID?: Snowflake;
	}
) {
	const {
		applicationID = Config.applicationID,
		headers = Config.getHeaders(),
	} = options;

	const url = new URL(
		`/applications/${applicationID}/guilds/${guildID}/commands`,
		new URL(API_URL)
	);

	const response = await Client.patch(
		url,
		{
			headers,
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

export async function deleteGuildApplicationCommand(
	guildID: Snowflake,
	commandID: Snowflake,
	options: {
		headers?: Record<string, string>;
		applicationID?: Snowflake;
	}
) {
	const {
		applicationID = Config.applicationID,
		headers = Config.getHeaders(),
	} = options;

	const url = new URL(
		`/applications/${applicationID}/guilds/${guildID}/commands/${commandID}`,
		new URL(API_URL)
	);

	const response = await Client.delete(
		url,
		{
			headers,
		},
		{
			route:
				"[DELETE] /applications/{application.id}/guilds/{guild.id}/commands/{command.id}",
			identifier: guildID,
		}
	);

	return response.ok;
}
