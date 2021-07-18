#!/usr/bin/env node

import prompts from "prompts";
import arg from "arg";
import fs from "fs";
import path from "path";
import package from "../package.json";
import { ApplicationCommand } from "../src/api/api";
import { Snowflake } from "../src/data/snowflake";
import Command from "../src/command";

async function deploy() {
	const deletedCommands: ApplicationCommand[] = [];
	const updatedCommands: Map<Snowflake, Command> = new Map();
	// Load application file, import app
	const application = {};
	// Get list of commands

	// TODO: Error handling
	let response = await fetch(
		`https://discord.com/api/v8/applications/${process.env.APPLICATION_ID}/commands`
	);
	const json: ApplicationCommand[] = await response.json();

	// TODO: register unaccounted for commands
	// we need to think about a clean way of examining all commands
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

	// TODO: Create new commands

	// Update modified commands
	response = await fetch(
		`https://discord.com/api/v8/applications/${process.env.APPLICATION_ID}/commands`,
		{
			method: "PUT",
			body: JSON.stringify(
				Array.from(updatedCommands.entries()).map(([key, value]) => ({
					id: key,
					...value.serialize(),
				}))
			),
		}
	);

	if (response.ok) {
		console.log(`Updated the following commands:`);
		updatedCommands.forEach((cmd) => {
			console.log(`\t${cmd.name}`);
		});
	}

	// Delete removed commands
	for (const command of deletedCommands) {
		response = await fetch(
			`https://discord.com/api/v8/applications/${process.env.APPLICATION_ID}/commands/${command.id}`,
			{
				method: "DELETE",
			}
		);

		if (response.ok) {
			console.log(`Deleted ${command.name}`);
		}
	}

	console.log("Done updating Discord API");
}

process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));

const commands = {
	new: import("./new").then((mod) => mod.default),
	dev: "",
	deploy: "",
	start: "",
};

const args = arg(
	{
		"--version": Boolean,
		"-v": "--version",

		"--help": Boolean,
		"-h": "--help",
	},
	{ permissive: true }
);

const command = args._[0];

console.log({ args, command });

if (args["--version"]) {
	console.log("Not verison 1, I'll tell ya that one for free buddy");
	// TODO: Some standard message with package.version
	return;
}

if (args["--help"] && !(command in commands)) {
	// TODO: General help
	console.log("Help");
	return;
}

if (command === "new") {
	return commands.new(args._[1]);
} else {
	console.log("No");
	return;
}

// import { Command } from "commander";

// const cli = new Command();

// // TODO: Make all these options optional
// cli
//   .command("new [name]")
//   .option("--server <server>", "An ID for your development server")
//   .option("--token <token>")
//   .option("--public_key <publicKey>")
//   .option("--application_id <applicationID>")
//   .description("Creates a new Interaction Kit project")
//   .action((name, server, token, publicKey, applicationID) => {
//     console.log({ name, server, token, publicKey, applicationID });
//     // TODO: for each non-set value, prompt the user for information
//     // TODO: Scaffold the following structure:
//     /**
//       src/
//       ├─ ping.js
//       .gitignore
//       .env
//       package.json
//       index.js
//       README.md
//      */
//   });

// cli
//   .command("dev")
//   .description("Run your Interaction Kit application in a development mode")
//   .action(() => {
//     console.log("Unimplemented");
//     // TODO: Load dotenv
//     // TODO: Load from package.json "main" file
//   });

// cli
//   .command("deploy")
//   .description("Deploy your Interaction Kit application")
//   .action();

// cli
//   .command("start")
//   .description("Run your Interaction Kit application in a production mode")
//   .action();
