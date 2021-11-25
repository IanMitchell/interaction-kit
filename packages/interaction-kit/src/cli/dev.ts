import ngrok from "ngrok";
import chokidar from "chokidar";
import arg from "arg";
import * as API from "../api";
import {
	getApplicationEntrypoint,
	getGuildApplicationCommandChanges,
} from "../scripts";
import Application from "../application";
import { Snowflake, ApplicationCommand } from "../definitions";

const CONFIG_FILES = [".env"];
const BOT_FILES = ["package.json", "src/**/*"];

/* eslint-disable */
// @ts-expect-error TS Dumb
const listFormatter = new Intl.ListFormat("en", {
	style: "long",
	type: "conjunction",
});

function getCommandLogList(commands: ApplicationCommand[]): string {
	return listFormatter.format(commands.map((cmd) => cmd.name));
}
/* eslint-enable */

async function startDevServer(application: Application) {
	console.log("Checking for command updates in Development Server");

	const guildID: Snowflake = process.env.DEVELOPMENT_SERVER_ID as Snowflake;
	const devCommandChangeSet = await getGuildApplicationCommandChanges(
		application,
		guildID
	);

	console.log(
		`${devCommandChangeSet.newCommands.size} new commands, ${devCommandChangeSet.updatedCommands.size} changed commands, ${devCommandChangeSet.deletedCommands.size} removed commands, and ${devCommandChangeSet.unchangedCommands.size} unchanged commands.`
	);

	const commandList = [
		...devCommandChangeSet.newCommands,
		...devCommandChangeSet.updatedCommands,
		...devCommandChangeSet.unchangedCommands,
	];

	try {
		if (commandList.length > 0) {
			await API.putGuildApplicationCommands(guildID, commandList, {
				applicationID: application.id,
			});
		}
	} catch (error: unknown) {
		console.log({ error });
	}

	if (devCommandChangeSet.deletedCommands.size > 0) {
		const deletedCommandList = Array.from(devCommandChangeSet.deletedCommands);
		const logList = getCommandLogList(deletedCommandList);
		console.log(`Deleting ${logList} commands...`);
		await Promise.all(
			deletedCommandList.map(async (cmd) =>
				API.deleteGuildApplicationCommand(guildID, cmd.id, {
					applicationID: application.id,
				})
			)
		);
	}

	// TODO: Iterate on guild commands

	console.log("Starting server...");
	return application.startServer();
}

export default async function dev(argv?: string[]) {
	// Handle Help
	if (argv?.includes("--help")) {
		console.log(`
			Description
				Creates all new commands, updates all changed commands, and deletes all removed commands from Discord.

			Usage
				$ ikit deploy
  	`);
		process.exit(0);
	}

	if (!process.env.DEVELOPMENT_SERVER_ID) {
		console.error("Missing `DEVELOPMENT_SERVER_ID` env variable. <link>");
		process.exit(0);
	}

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

	// Start application
	let application = await getApplicationEntrypoint();
	let server = await startDevServer(application);

	// Listen for config file changes and let user know they need to reload
	const configWatcher = chokidar.watch(CONFIG_FILES, {
		ignoreInitial: true,
	});
	configWatcher.on("change", (path) => {
		console.log(
			`Change detected in ${path} - please restart your application!`
		);
	});

	// Watch for changes requiring application reloads
	const botWatcher = chokidar.watch(BOT_FILES, {
		ignoreInitial: true,
	});
	const handler = async () => {
		console.log("Reloading application");

		// Reset server and watchers
		await server.close();
		console.log("Server shutdown");

		// Reload the application
		application = await getApplicationEntrypoint();
		server = await startDevServer(application);
	};

	botWatcher.on("change", (path) => {
		console.log(`${path} changed, reloading`);
		void handler();
	});
	botWatcher.on("add", (path) => {
		console.log(`${path} was added, reloading`);
		console.log(path);
		void handler();
	});
	botWatcher.on("unlink", (path) => {
		console.log(`${path} was removed, reloading`);
		void handler();
	});

	// Start up ngrok tunnel to connect with
	console.log("Starting Tunnel...");

	const url = await ngrok.connect({
		addr: port,
		onLogEvent: (msg) => {
			console.log(`ngrok Log Event: ${msg}`);
		},
		onStatusChange: (status) => {
			console.log(`Status ${status}`);
		},
		onTerminated: async () => {
			console.log("ngrok tunnel terminated");

			// Cleanup
			await server.close();
			process.exit(0);
		},
	});

	console.log(`ngrok tunnel started for http://localhost:${port}\n${url}`);
	console.log("Add this as your test bot thing. More info: <url>");
}
