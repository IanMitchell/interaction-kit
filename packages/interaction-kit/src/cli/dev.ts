import arg from "arg";
import boxen from "boxen";
import chalk from "chalk";
import debug from "debug";
import {
	bulkOverwriteGuildApplicationCommands,
	client,
	getGuildApplicationCommands,
	updateApplication,
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
	try {
		// Start application
		const application = await getApplicationEntrypoint();

		log("Checking for command updates in Development Server");
		const comparison = await getGuildApplicationCommandChanges(
			application,
			guildId,
			commands
		);

		const totalCommands =
			comparison.new.size +
			comparison.updated.size +
			comparison.deleted.size +
			comparison.unchanged.size;

		log(
			`Refreshing ${totalCommands} Command${
				totalCommands > 1 ? "s" : ""
			}: ${listFormatter.format([
				chalk.green(`${comparison.new.size} new`),
				chalk.yellow(`${comparison.updated.size} updated`),
				chalk.red(`${comparison.deleted.size} deleted`),
			])}`
		);

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
	client.setToken(process.env.TOKEN);

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
	const applicationId = process.env.APPLICATION_ID as Snowflake;
	let entrypoint = args["--entrypoint"];

	let commands: RESTGetAPIApplicationGuildCommandsResult;

	try {
		entrypoint = getEdgeEntrypoint(entrypoint);
		commands = await getGuildApplicationCommands(applicationId, guildId);
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

	// Update interaction URL
	try {
		await updateApplication(applicationId, url);
	} catch (err: unknown) {
		log(err);
	}

	// Some math to make things pretty
	const onlineText = `Your Application is now running!`;
	const ngrokUrl = `Interaction URL: ${url}`;
	const centerPadding = Math.floor((ngrokUrl.length - onlineText.length) / 2);

	console.log(
		boxen(
			`${onlineText.padStart(
				onlineText.length + centerPadding,
				" "
			)}\n\n${chalk.gray(
				`Interaction URL: ${chalk.blue(
					url
				)}\nListening on: http://localhost:${port}`
			)}`,
			{
				title: "Interaction Kit",
				titleAlignment: "left",
				padding: 1,
				margin: 1,
				align: "left",
				borderColor: "yellow",
				borderStyle: "round",
			}
		)
	);
}
