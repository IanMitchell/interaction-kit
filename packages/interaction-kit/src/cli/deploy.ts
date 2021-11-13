import {
	deleteGlobalApplicationCommand,
	putGlobalApplicationCommands,
	// deleteGuildApplicationCommand,
	// putGuildApplicationCommands,
} from "../api";
import {
	getApplicationEntrypoint,
	getApplicationCommandChanges,
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
	const { globalCommands } = await getApplicationCommandChanges(application);

	const globalCommandList = [
		...globalCommands.newCommands,
		...globalCommands.updatedCommands,
	];

	await putGlobalApplicationCommands(globalCommandList, {
		applicationID: application.id,
	});

	await Promise.all(
		Array.from(globalCommands.deletedCommands).map(async (id) =>
			deleteGlobalApplicationCommand(id, {
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
