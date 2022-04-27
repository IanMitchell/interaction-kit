import type { Snowflake } from "discord-snowflake";
import { APIApplicationCommand } from "discord-api-types/payloads/v9";
import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/rest/v9";
import path from "node:path";
import {
	getGlobalApplicationCommands,
	getGuildApplicationCommands,
} from "discord-api";
import Application from "./application";

export async function getApplicationEntrypoint(): Promise<Application> {
	try {
		/* eslint-disable*/
		const json = await import(path.join(process.cwd(), "package.json"), {
			assert: { type: "json" },
		});
		const app = await import(path.join(process.cwd(), json?.default?.main));
		return app?.default as Application;
		/* eslint-enable */
	} catch (error: unknown) {
		console.error("There was an error reading your application file:");
		// @ts-expect-error dumdum
		console.log(error.message);
		process.exit(1);
	}
}

function getChangeSet(
	application: Application,
	commandList: Map<string, APIApplicationCommand>
) {
	const changeSet = {
		hasChanges: false,
		newCommands: new Set<RESTPostAPIApplicationCommandsJSONBody>(),
		updatedCommands: new Set<RESTPostAPIApplicationCommandsJSONBody>(),
		deletedCommands: new Set<RESTPostAPIApplicationCommandsJSONBody>(),
		unchangedCommands: new Set<RESTPostAPIApplicationCommandsJSONBody>(),
	};

	// Compare all existing commands against registered ones
	for (const command of application.commands) {
		// If the command already exists, we check to see if it's changed or not
		if (commandList.has(command.name)) {
			const signature = commandList.get(command.name);

			// eyeroll @ ts
			if (signature == null) {
				continue;
			}

			if (command.equals(signature)) {
				changeSet.unchangedCommands.add(command.serialize());
			} else {
				changeSet.updatedCommands.add(command.serialize());
				changeSet.hasChanges = true;
			}

			commandList.delete(command.name);
		}
		// If the command does not exist, we add it
		else {
			changeSet.newCommands.add(command.serialize());
			changeSet.hasChanges = true;
		}
	}

	// Any command left in the Discord list no longer exists in the code; eliminate them
	changeSet.deletedCommands = new Set(Array.from(commandList.values()));

	if (changeSet.deletedCommands.size > 0) {
		changeSet.hasChanges = true;
	}

	return changeSet;
}

export async function getGlobalApplicationCommandChanges(
	application: Application
) {
	const response = await getGlobalApplicationCommands(application.id);
	const commandList = new Map(response.map((cmd) => [cmd.name, cmd]));
	return getChangeSet(application, commandList);
}

export async function getGuildApplicationCommandChanges(
	application: Application,
	guildId: Snowflake
) {
	const response = await getGuildApplicationCommands(guildId, application.id);
	const commandList = new Map(response.map((cmd) => [cmd.name, cmd]));
	return getChangeSet(application, commandList);
}
