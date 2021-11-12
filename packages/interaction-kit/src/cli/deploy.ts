import {
	deleteGlobalApplicationCommand,
	deleteGuildApplicationCommand,
	putGlobalApplicationCommands,
	putGuildApplicationCommands,
} from "../api";
import {
	getApplicationEntrypoint,
	getApplicationCommandChanges,
} from "../scripts";

export default async function command(argv?: string[]) {
	// TODO: parse args
	// TODO: Check for help?

	const application = getApplicationEntrypoint();
	const { globalCommands, guildCommands } = await getApplicationCommandChanges(
		application
	);

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

	for (const [guildID, commandList] of guildCommands.entries()) {
		const guildCommandList = [
			...commandList.newCommands,
			...commandList.updatedCommands,
		];

		await putGuildApplicationCommands(guildID, guildCommandList, {
			applicationID: application.id,
		});

		await Promise.all(
			Array.from(commandList.deletedCommands).map(async (id) =>
				deleteGuildApplicationCommand(guildID, id, {
					applicationID: application.id,
				})
			)
		);
	}

	process.exit(0);
}
