import type { Snowflake } from "discord-snowflake";
import rest from "./instance";
import Config from "./config";
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
	applicationId = Config.getApplicationId()
) {
	return rest.get(
		Routes.applicationCommands(applicationId)
	) as Promise<RESTGetAPIApplicationCommandsResult>;
}

// TODO: Test, Type, Document
export async function postGlobalApplicationCommand(
	command: RESTPostAPIApplicationCommandsJSONBody,
	applicationId = Config.getApplicationId()
) {
	return rest.post(Routes.applicationCommands(applicationId), {
		body: command,
	}) as Promise<RESTPostAPIApplicationCommandsResult>;
}

// TODO: Test, Type, Document
export async function putGlobalApplicationCommands(
	commands: RESTPutAPIApplicationCommandsJSONBody,
	applicationId = Config.getApplicationId()
) {
	return rest.put(Routes.applicationCommands(applicationId), {
		body: commands,
	}) as Promise<RESTPutAPIApplicationCommandsResult>;
}

// TODO: Test, Type, Document
export async function patchGlobalApplicationCommand(
	command: RESTPatchAPIApplicationCommandJSONBody & { id: Snowflake },
	applicationId = Config.getApplicationId()
) {
	return rest.patch(Routes.applicationCommand(applicationId, command.id), {
		body: command,
	}) as Promise<RESTPatchAPIApplicationCommandResult>;
}

// TODO: Test, Type, Document
export async function deleteGlobalApplicationCommand(
	commandId: Snowflake,
	applicationId = Config.getApplicationId()
) {
	return rest.delete(Routes.applicationCommand(applicationId, commandId));
}

// TODO: Test, Type, Document
export async function getGuildApplicationCommands(
	guildId: Snowflake,
	applicationId = Config.getApplicationId()
) {
	return rest.get(
		Routes.applicationGuildCommands(applicationId, guildId)
	) as Promise<RESTGetAPIApplicationGuildCommandsResult>;
}

// TODO: Test, Type, Document
export async function postGuildApplicationCommand(
	guildId: Snowflake,
	command: RESTPostAPIApplicationGuildCommandsJSONBody,
	applicationId = Config.getApplicationId()
) {
	return rest.post(Routes.applicationGuildCommands(applicationId, guildId), {
		body: command,
	}) as Promise<RESTPostAPIApplicationGuildCommandsResult>;
}

// TODO: Test, Type, Document
export async function putGuildApplicationCommands(
	guildId: Snowflake,
	commands: RESTPutAPIApplicationGuildCommandsJSONBody,
	applicationId = Config.getApplicationId()
) {
	return rest.put(Routes.applicationGuildCommands(applicationId, guildId), {
		body: commands,
	}) as Promise<RESTPutAPIApplicationGuildCommandsResult>;
}

// TODO: Test, Type, Document
export async function patchGuildApplicationCommand(
	guildId: Snowflake,
	command: RESTPatchAPIApplicationGuildCommandJSONBody & { id: Snowflake },
	applicationId = Config.getApplicationId()
) {
	return rest.patch(
		Routes.applicationGuildCommand(applicationId, guildId, command.id),
		{
			body: command,
		}
	) as Promise<RESTPatchAPIApplicationGuildCommandResult>;
}

// TODO: Test, Type, Document
export async function deleteGuildApplicationCommand(
	guildId: Snowflake,
	commandId: Snowflake,
	applicationId = Config.getApplicationId()
) {
	return rest.delete(
		Routes.applicationGuildCommand(applicationId, guildId, commandId)
	);
}
