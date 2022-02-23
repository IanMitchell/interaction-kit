import path from "node:path";
import * as API from "./api";
import Application from "./application";
import { ApplicationCommand, Snowflake } from "./definitions";

export async function getApplicationEntrypoint(): Promise<Application> {
	try {
		/* eslint-disable*/
		const json = await import(path.join(process.cwd(), "package.json"));
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
	commandList: Map<string, ApplicationCommand>
) {
	const changeSet = {
		hasChanges: false,
		newCommands: new Set<ApplicationCommand>(),
		updatedCommands: new Set<ApplicationCommand>(),
		deletedCommands: new Set<ApplicationCommand>(),
		unchangedCommands: new Set<ApplicationCommand>(),
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
	const response = await API.getGlobalApplicationCommands({
		applicationID: application.id,
	});
	const commandList = new Map(response.map((cmd) => [cmd.name, cmd]));
	return getChangeSet(application, commandList);
}

export async function getGuildApplicationCommandChanges(
	application: Application,
	guildID: Snowflake
) {
	const response = await API.getGuildApplicationCommands(guildID, {
		applicationID: application.id,
	});
	const commandList = new Map(response.map((cmd) => [cmd.name, cmd]));
	return getChangeSet(application, commandList);
}
