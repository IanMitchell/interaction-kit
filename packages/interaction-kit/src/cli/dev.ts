import arg from "arg";
import boxen from "boxen";
import chalk from "chalk";
import debug from "debug";
import { putGuildApplicationCommands } from "discord-api";
import server from "discord-edge-runner";
import type { Snowflake } from "discord-snowflake";
import ngrok from "ngrok";
import {
	getApplicationEntrypoint,
	getEdgeEntrypoint,
	getGuildApplicationCommandChanges,
} from "../scripts";

const log = debug("cli:dev");

async function updateCommands(guildId: Snowflake) {
	// Start application
	const application = await getApplicationEntrypoint();

	log("Checking for command updates in Development Server");
	const devCommandChangeSet = await getGuildApplicationCommandChanges(
		application,
		guildId
	);

	log(
		`${devCommandChangeSet.newCommands.size} new commands, ${devCommandChangeSet.updatedCommands.size} changed commands, ${devCommandChangeSet.deletedCommands.size} removed commands, and ${devCommandChangeSet.unchangedCommands.size} unchanged commands.`
	);

	const serializedCommands = application.commands.map((command) =>
		command.serialize()
	);

	try {
		if (devCommandChangeSet.hasChanges) {
			await putGuildApplicationCommands(
				application.id,
				guildId,
				serializedCommands
			);
		}
	} catch (error: unknown) {
		log((error as Error).message);
	}
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
		},
		{
			permissive: true,
		}
	);

	const port = args["--port"] ?? 3000;
	const entrypoint = await getEdgeEntrypoint();

	const runner = await server({
		entrypoint,
		port,
		env: {
			// TODO: Figure out how to dynamically assign these and how to add custom env variables
			APPLICATION_ID: process.env.APPLICATION_ID,
			PUBLIC_KEY: process.env.PUBLIC_KEY,
			TOKEN: process.env.TOKEN,
			DEBUG: process.env.DEBUG ?? "",
		},
		onReload: async () => {
			await updateCommands(guildId);
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
