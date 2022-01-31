import rest from "./instance";
import Config from "./config";
import { ApplicationCommand, Snowflake } from "../definitions";
import { Optional } from "../interfaces";
import {
	RESTGetAPIApplicationCommandsResult,
	RESTGetAPIApplicationGuildCommandsResult,
	RESTPatchAPIApplicationCommandResult,
	RESTPatchAPIApplicationGuildCommandResult,
	RESTPostAPIApplicationCommandsResult,
	RESTPostAPIApplicationGuildCommandsResult,
	RESTPutAPIApplicationCommandsResult,
	RESTPutAPIApplicationGuildCommandsResult,
	Routes,
} from "discord-api-types/v9";

// TODO: Test, Type, Document
export async function getGlobalApplicationCommands(
	applicationID: Snowflake = Config.getApplicationID()
) {
	return rest.get(
		Routes.applicationCommands(applicationID)
	) as Promise<RESTGetAPIApplicationCommandsResult>;
}

// TODO: Test, Type, Document
export async function postGlobalApplicationCommand(
	command: Omit<ApplicationCommand, "id" | "application_id">,
	applicationID: Snowflake = Config.getApplicationID()
) {
	return rest.post(Routes.applicationCommands(applicationID), {
		body: command,
	}) as Promise<RESTPostAPIApplicationCommandsResult>;
}

// TODO: Test, Type, Document
export async function putGlobalApplicationCommands(
	commands: Array<Optional<ApplicationCommand, "id" | "application_id">>,
	applicationID: Snowflake = Config.getApplicationID()
) {
	return rest.put(Routes.applicationCommands(applicationID), {
		body: commands,
	}) as Promise<RESTPutAPIApplicationCommandsResult>;
}

// TODO: Test, Type, Document
export async function patchGlobalApplicationCommand(
	command: Optional<
		ApplicationCommand,
		"name" | "description" | "options" | "default_permission"
	>,
	applicationID: Snowflake = Config.getApplicationID()
) {
	return rest.patch(Routes.applicationCommand(applicationID, command.id), {
		body: command,
	}) as Promise<RESTPatchAPIApplicationCommandResult>;
}

// TODO: Test, Type, Document
export async function deleteGlobalApplicationCommand(
	commandID: Snowflake,
	applicationID: Snowflake = Config.getApplicationID()
) {
	return rest.delete(Routes.applicationCommand(applicationID, commandID));
}

// TODO: Test, Type, Document
export async function getGuildApplicationCommands(
	guildID: Snowflake,
	applicationID: Snowflake = Config.getApplicationID()
) {
	return rest.get(
		Routes.applicationGuildCommands(applicationID, guildID)
	) as Promise<RESTGetAPIApplicationGuildCommandsResult>;
}

// TODO: Test, Type, Document
export async function postGuildApplicationCommand(
	guildID: Snowflake,
	command: Omit<ApplicationCommand, "id" | "application_id">,
	applicationID: Snowflake = Config.getApplicationID()
) {
	return rest.post(Routes.applicationGuildCommands(applicationID, guildID), {
		body: command,
	}) as Promise<RESTPostAPIApplicationGuildCommandsResult>;
}

// TODO: Test, Type, Document
export async function putGuildApplicationCommands(
	guildID: Snowflake,
	commands: Array<Optional<ApplicationCommand, "id" | "application_id">>,
	applicationID: Snowflake = Config.getApplicationID()
) {
	return rest.put(Routes.applicationGuildCommands(applicationID, guildID), {
		body: commands,
	}) as Promise<RESTPutAPIApplicationGuildCommandsResult>;
}

// TODO: Test, Type, Document
export async function patchGuildApplicationCommand(
	guildID: Snowflake,
	command: Optional<
		ApplicationCommand,
		"name" | "description" | "options" | "default_permission"
	>,
	applicationID: Snowflake = Config.getApplicationID()
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
	applicationID: Snowflake = Config.getApplicationID()
) {
	return rest.delete(
		Routes.applicationGuildCommand(applicationID, guildID, commandID)
	);
}
