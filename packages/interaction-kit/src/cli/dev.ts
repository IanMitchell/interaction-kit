import { putGuildApplicationCommands } from "discord-api";
import ngrok from "ngrok";
import debug from "debug";
import arg from "arg";
import spawn from "cross-spawn";
import { ChildProcess } from "child_process";
import chalk from "chalk";
import boxen from "boxen";
import { Snowflake } from "discord-snowflake";
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
	let child: ChildProcess | null = null;

	const handler = async () => {
		console.log("Reloading application");
		await updateCommands(guildId);

		child?.kill();
		console.log("Starting Wrangler");
		child = spawn("wrangler", ["dev", "-p", port.toString()], {
			stdio: "inherit",
		});
	};

	const url = await ngrok.connect({
		addr: port,
		// onLogEvent: (msg) => {
		// 	console.log(`ngrok Log Event: ${msg}`);
		// },
		// onStatusChange: (status) => {
		// 	console.log(`Status ${status}`);
		// },
		onTerminated: async () => {
			log("Tunnel terminated. Please restart process");

			// Cleanup
			child?.kill();
			process.exit(0);
		},
	});
	void handler();

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
