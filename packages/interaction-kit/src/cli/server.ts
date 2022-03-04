import * as API from "../api";
import {
	getApplicationEntrypoint,
	getGuildApplicationCommandChanges,
} from "../scripts";
import { Snowflake } from "../interfaces";

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
			await API.putGuildApplicationCommands(
				guildID,
				serializedCommands,
				application.id
			);
		}
	} catch (error: unknown) {
		console.log({ error });
	}
}
