import { getGlobalApplicationCommands } from "./api";
import Application from "./application";
import { ApplicationCommand, Snowflake } from "./definitions";
import { Optional } from "./interfaces";

export async function getApplicationEntrypoint(): Promise<Application> {
	// @ts-expect-error ????
	const json = await import(path.join(process.cwd(), "package.json"));
	// @ts-expect-error ????
	const app = await import(path.join(process.cwd(), json?.default?.main));
	return app?.default as Application;
}

type CommandList = {
	newCommands: Set<Optional<ApplicationCommand, "id">>;
	updatedCommands: Set<ApplicationCommand>;
	deletedCommands: Set<Snowflake>;
	unchangedCommands: Set<ApplicationCommand>;
};

export async function getApplicationCommandChanges(application: Application) {
	const globalCommandList = {
		newCommands: new Set<ApplicationCommand>(),
		updatedCommands: new Set<ApplicationCommand>(),
		deletedCommands: new Set<Snowflake>(),
		unchangedCommands: new Set<ApplicationCommand>(),
	};

	const guildCommandList = new Map<Snowflake, CommandList>();

	const response = await getGlobalApplicationCommands({
		applicationID: application.id,
	});
	const globalCommands = new Map(response.map((cmd) => [cmd.name, cmd]));

	// Compare all existing commands against registered ones
	for (const command of application.commands) {
		// If the command already exists, we check to see if it's changed or not
		if (globalCommands.has(command.name)) {
			const signature = globalCommands.get(command.name);

			// eyeroll @ ts
			if (signature == null) {
				continue;
			}

			if (command.equals(signature)) {
				globalCommandList.unchangedCommands.add(signature);
			} else {
				globalCommandList.updatedCommands.add(signature);
			}

			globalCommands.delete(command.name);
		}
		// If the command does not exist, we add it
		else {
			// @ts-expect-error ????
			globalCommandList.newCommands.add(command.serialize());
		}
	}

	// Any command left in the Discord list no longer exists in the code; eliminate them
	globalCommandList.deletedCommands = new Set(
		Array.from(globalCommands.values()).map((cmd) => cmd.id)
	);

	// TODO: Compute (also, how are we gonna do guilds?)

	return {
		globalCommands: globalCommandList,
		guildCommands: guildCommandList,
	};
}
