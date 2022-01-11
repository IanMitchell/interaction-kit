import arg from "arg";
import * as API from "../api";
import {
	getApplicationEntrypoint,
	getGuildApplicationCommandChanges,
} from "../scripts";
import { Snowflake } from "../definitions";

export default async function server(argv?: string[]) {
	// Handle Help
	if (argv?.includes("--help")) {
		console.log(`
			Description
				Starts up a server to handle Discord interactions.

			Usage
				$ ikit server [-p <port>]
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
	const guildID = process.env.DEVELOPMENT_SERVER_ID as Snowflake;

	// Start application
	const application = await getApplicationEntrypoint();

	console.log("Checking for command updates in Development Server");
	const devCommandChangeSet = await getGuildApplicationCommandChanges(
		application,
		guildID
	);

	console.log(
		`${devCommandChangeSet.newCommands.size} new commands, ${devCommandChangeSet.updatedCommands.size} changed commands, ${devCommandChangeSet.deletedCommands.size} removed commands, and ${devCommandChangeSet.unchangedCommands.size} unchanged commands.`
	);

	const serializedCommands = application.commands.map((command) =>
		command.serialize()
	);

	try {
		if (devCommandChangeSet.hasChanges) {
			await API.putGuildApplicationCommands(guildID, serializedCommands, {
				applicationID: application.id,
			});
		}
	} catch (error: unknown) {
		console.log({ error });
	}

	console.log("Starting server...");
	const server = await application.startServer(port);

	process.on("SIGTERM", async () => server.close());
	process.on("SIGINT", async () => server.close());
}
