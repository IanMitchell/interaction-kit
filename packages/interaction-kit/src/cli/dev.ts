import arg from "arg";
import boxen from "boxen";
import chalk from "chalk";
import debug from "debug";
import { putGuildApplicationCommands } from "discord-api";
import { Snowflake } from "discord-snowflake";
import ngrok from "ngrok";
import {
	getApplicationEntrypoint,
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
		console.error("Missing `DEVELOPMENT_SERVER_ID` env variable. <link>");
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

	// eslint-disable @typescript-eslint/no-unused-expressions
	// @ts-expect-error We're faking worker state
	global.APPLICATION_ID = process.env.APPLICATION_ID;
	// @ts-expect-error We're faking worker state
	global.PUBLIC_KEY = process.env.PUBLIC_KEY;
	// @ts-expect-error We're faking worker state
	global.TOKEN = process.env.TOKEN;
	// eslint-enable @typescript-eslint/no-unused-expressions

	// const server = new Miniflare({
	// 	watch: true,
	// 	port,
	// 	packagePath: true,
	// 	modules: true,
	// 	globals: {
	// 		APPLICATION_ID: process.env.APPLICATION_ID,
	// 		PUBLIC_KEY: process.env.PUBLIC_KEY,
	// 		TOKEN: process.env.TOKEN,
	// 	},
	// });

	// server.addEventListener("reload", async () => updateCommands(guildId));
	await updateCommands(guildId);

	const url = await ngrok.connect({
		addr: port,
		onTerminated: () => {
			log("Tunnel terminated. Please restart process");

			// Cleanup
			// await server.dispose();
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
