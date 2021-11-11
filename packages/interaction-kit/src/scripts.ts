import { getGlobalApplicationCommands } from "./api";
import Application from "./application";
import { Snowflake } from "./definitions";

export function getApplicationEntrypoint(): Application {
	const json = await import(path.join(process.cwd(), "package.json"));
	const app = await import(path.join(process.cwd(), json?.default?.main));
	return app?.default as Application;
}

export function getApplicationCommandChanges(application: Application) {
	const newCommands = new Set<Command>();
	const updatedCommands = new Map<Snowflake, Command>();
	const deletedCommands = new Set<Command>();
	const unchangedCommands = new Map<Snowflake, Command>();

	const globalCommands = await getGlobalApplicationCommands();

	// TODO: Compute (also, how are we gonna do guilds?)

	return {
		deletedCommands,
		updatedCommands,
		newCommands,
		unchangedCommands,
	};
}
