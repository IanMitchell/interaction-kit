import type { Snowflake } from "discord-snowflake";
import { client } from "../client";
import {
	Routes,
	RESTGetAPIApplicationCommandsResult,
	RESTGetAPIApplicationGuildCommandsResult,
	RESTPatchAPIApplicationCommandJSONBody,
	RESTPatchAPIApplicationCommandResult,
	RESTPatchAPIApplicationGuildCommandJSONBody,
	RESTPatchAPIApplicationGuildCommandResult,
	RESTPostAPIApplicationCommandsJSONBody,
	RESTPostAPIApplicationCommandsResult,
	RESTPostAPIApplicationGuildCommandsJSONBody,
	RESTPostAPIApplicationGuildCommandsResult,
	RESTPutAPIApplicationCommandsJSONBody,
	RESTPutAPIApplicationCommandsResult,
	RESTPutAPIApplicationGuildCommandsJSONBody,
	RESTPutAPIApplicationGuildCommandsResult,
} from "discord-api-types/v10";

// TODO: Test, Document
export async function getGlobalApplicationCommands(applicationId: Snowflake) {
	return client.get(
		Routes.applicationCommands(applicationId)
	) as Promise<RESTGetAPIApplicationCommandsResult>;
}

// TODO: Test, Document
export async function postGlobalApplicationCommand(
	applicationId: Snowflake,
	command: RESTPostAPIApplicationCommandsJSONBody
) {
	return client.post(Routes.applicationCommands(applicationId), {
		body: command,
	}) as Promise<RESTPostAPIApplicationCommandsResult>;
}

// TODO: Test, Document
export async function putGlobalApplicationCommands(
	applicationId: Snowflake,
	commands: RESTPutAPIApplicationCommandsJSONBody
) {
	return client.put(Routes.applicationCommands(applicationId), {
		body: commands,
	}) as Promise<RESTPutAPIApplicationCommandsResult>;
}

// TODO: Test, Document
export async function patchGlobalApplicationCommand(
	applicationId: Snowflake,
	command: RESTPatchAPIApplicationCommandJSONBody & { id: Snowflake }
) {
	return client.patch(Routes.applicationCommand(applicationId, command.id), {
		body: command,
	}) as Promise<RESTPatchAPIApplicationCommandResult>;
}

// TODO: Test, Document
export async function deleteGlobalApplicationCommand(
	applicationId: Snowflake,
	commandId: Snowflake
) {
	return client.delete(Routes.applicationCommand(applicationId, commandId));
}

// TODO: Test, Document
export async function getGuildApplicationCommands(
	applicationId: Snowflake,
	guildId: Snowflake
) {
	return client.get(
		Routes.applicationGuildCommands(applicationId, guildId)
	) as Promise<RESTGetAPIApplicationGuildCommandsResult>;
}

// TODO: Test, Document
export async function postGuildApplicationCommand(
	applicationId: Snowflake,
	guildId: Snowflake,
	command: RESTPostAPIApplicationGuildCommandsJSONBody
) {
	return client.post(Routes.applicationGuildCommands(applicationId, guildId), {
		body: command,
	}) as Promise<RESTPostAPIApplicationGuildCommandsResult>;
}

// TODO: Test, Document
export async function putGuildApplicationCommands(
	applicationId: Snowflake,
	guildId: Snowflake,
	commands: RESTPutAPIApplicationGuildCommandsJSONBody
) {
	return client.put(Routes.applicationGuildCommands(applicationId, guildId), {
		body: commands,
	}) as Promise<RESTPutAPIApplicationGuildCommandsResult>;
}

// TODO: Test, Document
export async function patchGuildApplicationCommand(
	applicationId: Snowflake,
	guildId: Snowflake,
	command: RESTPatchAPIApplicationGuildCommandJSONBody & { id: Snowflake }
) {
	return client.patch(
		Routes.applicationGuildCommand(applicationId, guildId, command.id),
		{
			body: command,
		}
	) as Promise<RESTPatchAPIApplicationGuildCommandResult>;
}

// TODO: Test, Document
export async function deleteGuildApplicationCommand(
	applicationId: Snowflake,
	guildId: Snowflake,
	commandId: Snowflake
) {
	return client.delete(
		Routes.applicationGuildCommand(applicationId, guildId, commandId)
	);
}
