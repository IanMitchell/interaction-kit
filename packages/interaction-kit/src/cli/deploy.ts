import { putGuildApplicationCommands } from "../api";
import { getApplicationEntrypoint } from "../scripts/application";
import { getApplicationCommandChanges } from "../scripts/commands";

export default async function command(argv?: string[]) {
	// TODO: Check for help?
	// TODO: parse args

	const application = getApplicationEntrypoint();
	const differences = getApplicationCommandChanges(application);

	Array.from(differences.newCommands).forEach((command) => {
		// TODO: create
	});

	Array.from(differences.updatedCommands).forEach((command) => {});

	Array.from(differences.deletedCommands).forEach((command) => {
		// TODO: delete
	});
}
