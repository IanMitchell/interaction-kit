import arg from "arg";
import boxen from "boxen";
import chalk from "chalk";
import debug from "debug";
import { putGuildApplicationCommands } from "discord-api";
import type { Snowflake } from "discord-snowflake";
import { EdgeRuntime, runServer } from "edge-runtime";
import esbuild from "esbuild";
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
	const entrypoint = await getEdgeEntrypoint();

	const runtime = new EdgeRuntime({
		extend: (context) =>
			Object.assign(context, {
				process: {
					env: {
						// TODO: Figure out how to dynamically assign these and how to add custom env variables
						NODE_ENV: "development",
						APPLICATION_ID: process.env.APPLICATION_ID,
						PUBLIC_KEY: process.env.PUBLIC_KEY,
						TOKEN: process.env.TOKEN,
					},
				},
			}),
	});

	const server = await runServer({
		runtime,
		port,
	});

	const handler = async (code: string) => {
		try {
			console.log("Updating Commands");
			await updateCommands(guildId);
		} catch (error: unknown) {
			console.error(error);
		}

		try {
			console.log("Updating Edge Runtime");
			runtime.evaluate(code);
		} catch (error: unknown) {
			console.log(error);
		}

		console.log("Done!");
	};

	const compiler = await esbuild.build({
		entryPoints: [entrypoint],
		bundle: true,
		write: false,
		// format: "cjs",
		watch: {
			async onRebuild(error, result) {
				if (error) {
					console.error(error);
					return;
				}

				void handler(result?.outputFiles?.[0].text ?? "");
			},
		},
	});

	void handler(compiler.outputFiles[0].text ?? "");

	const url = await ngrok.connect({
		addr: port,
		onTerminated: async () => {
			log("Tunnel terminated. Please restart process");

			await server.close();
			compiler.stop?.();
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
