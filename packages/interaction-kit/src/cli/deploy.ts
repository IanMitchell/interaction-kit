import { putGlobalApplicationCommands } from "discord-api";
import { RESTPutAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import { getApplicationEntrypoint } from "../scripts";

export default async function command(argv?: string[]) {
	if (argv?.includes("--help")) {
		console.log(`
			Description
				Registers all new commands, updates all changed commands, and deletes all removed commands from Discord.

			Usage
				$ ikit deploy
  	`);
		process.exit(0);
	}

	const application = await getApplicationEntrypoint();
	const serializedCommands: RESTPutAPIApplicationCommandsJSONBody =
		application.commands.map((command) => command.serialize());

	await putGlobalApplicationCommands(application.id, serializedCommands);
	process.exit(0);
}
