#!/usr/bin/env node
import path from "node:path";
import ngrok from "ngrok";
import Application from "../src/application";
import { ApplicationCommand } from "../src/definitions";

const port = 3000;

async function dev() {
	let app: Application | null = null;

	try {
		const pkg = (
			await (import(path.join(process.cwd(), "package.json")) as Promise<{
				default: Record<string, unknown>;
			}>)
		).default;

		const appFile = pkg?.main as string;
		const appModule = (await import(
			path.join(process.cwd(), appFile)
		)) as Record<string, unknown>;
		app = appModule?.default as Application;
	} catch (error: unknown) {
		console.error(
			"There was an error finding your Application file! You can find out more info here <url>"
		);
		console.error(error);
	}

	if (app == null) {
		throw new Error("hm");
	}

	app.startServer();

	console.log("Starting Tunnel...");

	const url = await ngrok.connect({
		addr: port,
		onLogEvent: (msg) => {
			console.log(msg);
		},
		onStatusChange: (status) => {
			console.log(`Status ${status}`);
		},
		onTerminated: () => {
			console.log("Terminated");
		},
	});

	console.log(`URL: ${url}`);
	console.log("Add this as your test bot thing. More info: <url>");
}

async function deploy() {
	const deletedCommands: ApplicationCommand[] = [];
	const updatedCommands: Map<Snowflake, Command> = new Map();

	let response = await fetch(
		`https://discord.com/api/v8/applications/${process.env.APPLICATION_ID}/commands`
	);
	const json: ApplicationCommand[] = await response.json();

	json.forEach((registeredCommand) => {
		const command = application.getCommand(name);

		if (command == null /* || TODO: skipCheck on name */) {
			deletedCommands.push(registeredCommand);
			// TODO: skipCheck or remove
		} else {
			if (!command.isEqualTo(registeredCommand)) {
				updatedCommands.set(registeredCommand.id, command);
			}
		}
	});
}

void dev();
