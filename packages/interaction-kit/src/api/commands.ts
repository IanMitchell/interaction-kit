import rest from "./instance";
import Config from "./config";
import type { Snowflake } from "../structures/snowflake";
import {
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
	Routes,
} from "discord-api-types/v9";

// TODO: Test, Type, Document
export async function getGlobalApplicationCommands(
	applicationID = Config.getApplicationID()
) {
	return rest.get(
		Routes.applicationCommands(applicationID)
	) as Promise<RESTGetAPIApplicationCommandsResult>;
}

// TODO: Test, Type, Document
export async function postGlobalApplicationCommand(
	command: RESTPostAPIApplicationCommandsJSONBody,
	applicationID = Config.getApplicationID()
) {
	return rest.post(Routes.applicationCommands(applicationID), {
		body: command,
	}) as Promise<RESTPostAPIApplicationCommandsResult>;
}

// TODO: Test, Type, Document
export async function putGlobalApplicationCommands(
	commands: RESTPutAPIApplicationCommandsJSONBody,
	applicationID = Config.getApplicationID()
) {
	return rest.put(Routes.applicationCommands(applicationID), {
		body: commands,
	}) as Promise<RESTPutAPIApplicationCommandsResult>;
}

// TODO: Test, Type, Document
export async function patchGlobalApplicationCommand(
	command: RESTPatchAPIApplicationCommandJSONBody & { id: Snowflake },
	applicationID = Config.getApplicationID()
) {
	return rest.patch(Routes.applicationCommand(applicationID, command.id), {
		body: command,
	}) as Promise<RESTPatchAPIApplicationCommandResult>;
}

// TODO: Test, Type, Document
export async function deleteGlobalApplicationCommand(
	commandID: Snowflake,
	applicationID = Config.getApplicationID()
) {
	return rest.delete(Routes.applicationCommand(applicationID, commandID));
}

// TODO: Test, Type, Document
export async function getGuildApplicationCommands(
	guildID: Snowflake,
	applicationID = Config.getApplicationID()
) {
	return rest.get(
		Routes.applicationGuildCommands(applicationID, guildID)
	) as Promise<RESTGetAPIApplicationGuildCommandsResult>;
}

// TODO: Test, Type, Document
export async function postGuildApplicationCommand(
	guildID: Snowflake,
	command: RESTPostAPIApplicationGuildCommandsJSONBody,
	applicationID = Config.getApplicationID()
) {
	return rest.post(Routes.applicationGuildCommands(applicationID, guildID), {
		body: command,
	}) as Promise<RESTPostAPIApplicationGuildCommandsResult>;
}

// TODO: Test, Type, Document
export async function putGuildApplicationCommands(
	guildID: Snowflake,
	commands: RESTPutAPIApplicationGuildCommandsJSONBody,
	applicationID = Config.getApplicationID()
) {
	return rest.put(Routes.applicationGuildCommands(applicationID, guildID), {
		body: commands,
	}) as Promise<RESTPutAPIApplicationGuildCommandsResult>;
}

// TODO: Test, Type, Document
export async function patchGuildApplicationCommand(
	guildID: Snowflake,
	command: RESTPatchAPIApplicationGuildCommandJSONBody & { id: Snowflake },
	applicationID = Config.getApplicationID()
) {
	return rest.patch(
		Routes.applicationGuildCommand(applicationID, guildID, command.id),
		{
			body: command,
		}
	) as Promise<RESTPatchAPIApplicationGuildCommandResult>;
}

// TODO: Test, Type, Document
export async function deleteGuildApplicationCommand(
	guildID: Snowflake,
	commandID: Snowflake,
	applicationID = Config.getApplicationID()
) {
	return rest.delete(
		Routes.applicationGuildCommand(applicationID, guildID, commandID)
	);
}
