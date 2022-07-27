import arg from "arg";
import boxen from "boxen";
import chalk from "chalk";
import chokidar from "chokidar";
import debug from "debug";
import { putGuildApplicationCommands } from "discord-api";
import type { Snowflake } from "discord-snowflake";
import { EdgeRuntime, runServer } from "edge-runtime";
import esbuild from "esbuild";
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

	let code: Uint8Array | undefined;

	const runtime = new EdgeRuntime();
	const server = await runServer({
		runtime,
		port,
	});

	const url = await ngrok.connect({
		addr: port,
		onTerminated: async () => {
			log("Tunnel terminated. Please restart process");

			await server.close();
			process.exit(0);
		},
	});

	const handler = async () => {
		try {
			await updateCommands(guildId);
		} catch (error: unknown) {}

		try {
			const results = await esbuild.build({});
			code = results.outputFiles?.[0]?.contents;

			if (code) {
				runtime.evaluate(code.toString());
			} else {
				console.log("There was an error?");
			}
		} catch (error: unknown) {
			console.log(error);
		}
	};

	const watcher = chokidar.watch([], {
		ignoreInitial: true,
	});

	watcher.on("add", async () => {
		console.log("New file detected");
		void handler();
	});

	watcher.on("change", async () => {
		console.log("File change detected");
		void handler();
	});

	watcher.on("unlink", async () => {
		console.log("File deleted");
		void handler();
	});

	// Initial Setup
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
