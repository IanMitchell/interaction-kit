import type {
	RESTGetAPIApplicationCommandResult,
	RESTGetAPIApplicationCommandsResult,
	RESTGetAPIApplicationGuildCommandResult,
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
import { Routes } from "discord-api-types/v10";
import type { Snowflake } from "discord-snowflake";
import { client } from "../client";

/**
 * Global Commands
 */

// TODO: Test, Document
export async function getGlobalApplicationCommands(applicationId: Snowflake) {
	return client.get(
		Routes.applicationCommands(applicationId)
	) as Promise<RESTGetAPIApplicationCommandsResult>;
}

// TODO: Test, Document
export async function createGlobalApplicationCommand(
	applicationId: Snowflake,
	command: RESTPostAPIApplicationCommandsJSONBody
) {
	return client.post(Routes.applicationCommands(applicationId), {
		body: command,
	}) as Promise<RESTPostAPIApplicationCommandsResult>;
}

// TODO: Test, Document
export async function getGlobalApplicationCommand(
	applicationId: Snowflake,
	commandId: Snowflake
) {
	return client.get(
		Routes.applicationCommand(applicationId, commandId)
	) as Promise<RESTGetAPIApplicationCommandResult>;
}

// TODO: Test, Document
export async function editGlobalApplicationCommand(
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
export async function bulkOverwriteGlobalApplicationCommands(
	applicationId: Snowflake,
	commands: RESTPutAPIApplicationCommandsJSONBody
) {
	return client.put(Routes.applicationCommands(applicationId), {
		body: commands,
	}) as Promise<RESTPutAPIApplicationCommandsResult>;
}

/**
 * Guild Commands
 */

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
export async function createGuildApplicationCommand(
	applicationId: Snowflake,
	guildId: Snowflake,
	command: RESTPostAPIApplicationGuildCommandsJSONBody
) {
	return client.post(Routes.applicationGuildCommands(applicationId, guildId), {
		body: command,
	}) as Promise<RESTPostAPIApplicationGuildCommandsResult>;
}

// TODO: Test, Document
export async function getGuildApplicationCommand(
	applicationId: Snowflake,
	guildId: Snowflake,
	commandId: Snowflake
) {
	return client.get(
		Routes.applicationGuildCommand(applicationId, guildId, commandId)
	) as Promise<RESTGetAPIApplicationGuildCommandResult>;
}

// TODO: Test, Document
export async function editGuildApplicationCommands(
	applicationId: Snowflake,
	guildId: Snowflake,
	commands: RESTPutAPIApplicationGuildCommandsJSONBody
) {
	return client.put(Routes.applicationGuildCommands(applicationId, guildId), {
		body: commands,
	}) as Promise<RESTPutAPIApplicationGuildCommandsResult>;
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

// TODO: Test, Document
export async function bulkOverwriteGuildApplicationCommand(
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
