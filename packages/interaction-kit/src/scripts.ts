import {
	getGlobalApplicationCommands,
	getGuildApplicationCommands,
} from "discord-api";
import type {
	APIApplicationCommand,
	RESTGetAPIApplicationGuildCommandsResult,
	RESTPostAPIApplicationCommandsJSONBody,
} from "discord-api-types/v10";
import type { Snowflake } from "discord-snowflake";
import esbuild from "esbuild";
import fs from "node:fs";
import path from "node:path";
import type Application from "./application.js";

export async function getEdgeEntrypoint(filepath?: string) {
	if (filepath != null) {
		return path.join(process.cwd(), filepath);
	}

	const presets = ["/src/server.ts", "/src/server.js", "/src/server.mjs"];

	for (const preset of presets) {
		if (fs.existsSync(path.join(process.cwd(), preset))) {
			return path.join(process.cwd(), preset);
		}
	}

	throw new Error(
		`Could not find server entrypoint. Please create a server file named one of the following: ${presets
			.map((name) => `\`${name}\``)
			.join(", ")}`
	);
}

export async function getApplicationEntrypoint(): Promise<Application> {
	try {
		const json = (await import(path.join(process.cwd(), "package.json"), {
			assert: { type: "json" },
		})) as Record<string, any>;

		const appPath = json?.default?.main as string;

		let entrypoint = path.join(process.cwd(), appPath);

		if (entrypoint.endsWith(".ts")) {
			const build = await esbuild.build({
				entryPoints: [entrypoint],
				bundle: true,
				outdir: path.join(process.cwd(), ".ikit"),
			});

			entrypoint = path.join(
				process.cwd(),
				".ikit",
				appPath.replace("src/", "").replace(".ts", ".js")
			);
		}

		const app = (await import(entrypoint)) as { default: Application };
		return app?.default;
	} catch (error: unknown) {
		console.error("There was an error reading your application file:\n");
		console.error(error);
		process.exit(1);
	}
}

function getChangeSet(
	application: Application,
	commandList: Map<string, APIApplicationCommand>
) {
	const comparison = {
		changed: false,
		new: new Set<RESTPostAPIApplicationCommandsJSONBody>(),
		updated: new Set<RESTPostAPIApplicationCommandsJSONBody>(),
		deleted: new Set<RESTPostAPIApplicationCommandsJSONBody>(),
		unchanged: new Set<RESTPostAPIApplicationCommandsJSONBody>(),
	};

	// Compare all existing commands against registered ones
	for (const command of application.commands) {
		// If the command already exists, we check to see if it's changed or not
		if (commandList.has(command.name)) {
			const schema = commandList.get(command.name);

			if (schema == null) {
				continue;
			}

			if (command.equals(schema)) {
				comparison.unchanged.add(command.serialize());
			} else {
				comparison.updated.add(command.serialize());
				comparison.changed = true;
			}

			commandList.delete(command.name);
		}
		// If the command does not exist, we add it
		else {
			comparison.new.add(command.serialize());
			comparison.changed = true;
		}
	}

	// Any command left in the Discord list no longer exists in the code; eliminate them
	comparison.deleted = new Set(Array.from(commandList.values()));

	if (comparison.deleted.size > 0) {
		comparison.changed = true;
	}

	return comparison;
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
	guildId: Snowflake,
	cachedCommands?: RESTGetAPIApplicationGuildCommandsResult
) {
	const commandList = new Map<
		string,
		Omit<APIApplicationCommand, "dm_permission">
	>();

	if (cachedCommands == null) {
		const response = await getGuildApplicationCommands(application.id, guildId);
		response.forEach((cmd) => commandList.set(cmd.name, cmd));
	} else {
		cachedCommands.forEach((cmd) => commandList.set(cmd.name, cmd));
	}

	return getChangeSet(application, commandList);
}
