import * as API from "../api";
import {
	getApplicationEntrypoint,
	getGlobalApplicationCommandChanges,
} from "../scripts";

export default async function command(argv?: string[]) {
	if (argv?.includes("--help")) {
		console.log(`
			Description
				Creates all new commands, updates all changed commands, and deletes all removed commands from Discord.

			Usage
				$ ikit deploy
  	`);
		process.exit(0);
	}

	const application = await getApplicationEntrypoint();
	const globalCommandChangeSet = await getGlobalApplicationCommandChanges(
		application
	);

	const globalCommandList = [
		...globalCommandChangeSet.newCommands,
		...globalCommandChangeSet.updatedCommands,
		...globalCommandChangeSet.unchangedCommands,
	];

	await API.putGlobalApplicationCommands(globalCommandList, {
		applicationID: application.id,
	});

	await Promise.all(
		Array.from(globalCommandChangeSet.deletedCommands).map(async (cmd) =>
			API.deleteGlobalApplicationCommand(cmd.id, {
				applicationID: application.id,
			})
		)
	);

	// TODO: Enable once Guild Commands are figured out
	// for (const [guildID, commandList] of guildCommands.entries()) {
	// 	const guildCommandList = [
	// 		...commandList.newCommands,
	// 		...commandList.updatedCommands,
	// 	];

	// 	await putGuildApplicationCommands(guildID, guildCommandList, {
	// 		applicationID: application.id,
	// 	});

	// 	await Promise.all(
	// 		Array.from(commandList.deletedCommands).map(async (id) =>
	// 			deleteGuildApplicationCommand(guildID, id, {
	// 				applicationID: application.id,
	// 			})
	// 		)
	// 	);
	// }

	process.exit(0);
}
