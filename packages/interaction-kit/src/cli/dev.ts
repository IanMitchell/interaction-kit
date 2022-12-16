import arg from "arg";
import boxen from "boxen";
import chalk from "chalk";
import debug from "debug";
import {
	bulkOverwriteGuildApplicationCommands,
	getGuildApplicationCommands,
} from "discord-api";
import type { RESTGetAPIApplicationGuildCommandsResult } from "discord-api-types/v10";
import server from "discord-edge-runner";
import type { Snowflake } from "discord-snowflake";
import ngrok from "ngrok";
import {
	getApplicationEntrypoint,
	getEdgeEntrypoint,
	getGuildApplicationCommandChanges,
} from "../scripts.js";

const log = debug("cli:dev");

const listFormatter = new Intl.ListFormat("en", {
	style: "long",
	type: "conjunction",
});

async function updateCommands(
	guildId: Snowflake,
	commands: RESTGetAPIApplicationGuildCommandsResult
) {
	// Start application
	const application = await getApplicationEntrypoint();

	log("Checking for command updates in Development Server");
	const comparison = await getGuildApplicationCommandChanges(
		application,
		guildId,
		commands
	);

	log(
		listFormatter.format([
			chalk.green(`${comparison.new.size} new commands`),
			chalk.yellow(`${comparison.updated.size} updated commands`),
			chalk.red(`${comparison.deleted.size} deleted commands`),
			chalk.gray(`${comparison.unchanged.size} unchanged commands`),
		])
	);

	try {
		if (comparison.changed) {
			const serializedCommands = application.commands.map((command) =>
				command.serialize()
			);

			const response = await bulkOverwriteGuildApplicationCommands(
				application.id,
				guildId,
				serializedCommands
			);

			return response;
		}
	} catch (error: unknown) {
		log((error as Error).message);
	}

	return commands;
}

export default async function dev(argv?: string[]) {
	// Handle Help
	if (argv?.includes("--help")) {
		console.log(`
			Description
				Creates all new commands, updates all changed commands, and deletes all removed commands from Discord.

			Usage
				$ ikit dev [-p <port>]
  	`);
		process.exit(0);
	}

	if (!process.env.DEVELOPMENT_SERVER_ID) {
		log(chalk.red("Missing `DEVELOPMENT_SERVER_ID` env variable. <link>"));
		process.exit(0);
	}

	if (!process.env.APPLICATION_ID) {
		log(chalk.red("Missing `APPLICATION_ID` env variable. <link>"));
		process.exit(0);
	}

	if (!process.env.PUBLIC_KEY) {
		log(chalk.red("Missing `PUBLIC_KEY` env variable. <link>"));
		process.exit(0);
	}

	if (!process.env.TOKEN) {
		log(chalk.red("Missing `TOKEN` env variable. <link>"));
		process.exit(0);
	}

	const guildId = process.env.DEVELOPMENT_SERVER_ID as Snowflake;

	// Parse input args
	const args = arg(
		{
			"--port": Number,
			"-p": "--port",
			"--entrypoint": String,
			"-e": "--entrypoint",
		},
		{
			permissive: true,
		}
	);

	const port = args["--port"] ?? 3000;
	let entrypoint = args["--entrypoint"] ?? "";

	let commands = await getGuildApplicationCommands(
		process.env.APPLICATION_ID as Snowflake,
		guildId
	);

	try {
		entrypoint = await getEdgeEntrypoint(entrypoint);
	} catch (error: unknown) {
		log(chalk.red((error as Error).message));
		process.exit(1);
	}

	const runner = await server({
		entrypoint,
		port,
		env: {
			// TODO: Figure out how to dynamically assign these and how to add custom env variables
			APPLICATION_ID: process.env.APPLICATION_ID,
			PUBLIC_KEY: process.env.PUBLIC_KEY,
			TOKEN: process.env.TOKEN,
			DEBUG: process.env.DEBUG ?? "",
			DEBUG_COLORS: "ON",
			// Chalk
			FORCE_COLOR: "1",
		},
		onReload: async () => {
			commands = await updateCommands(guildId, commands);
		},
		onError: (error: unknown) => {
			log(chalk.red({ error }));
		},
	});

	const url = await ngrok.connect({
		addr: port,
		onTerminated: async () => {
			log("Tunnel terminated. Please restart process");

			await runner.close();
			process.exit(0);
		},
	});

	console.log(
		boxen(
			`Set your Application Interactions URL to:\n${chalk.blue(
				url
			)}\n\n${chalk.gray(`Listening on http://localhost:${port}`)}`,
			{
				padding: 1,
				margin: 1,
				align: "center",
				borderColor: "yellow",
				borderStyle: "round",
			}
		)
	);
}
