#!/usr/bin/env node
import arg from "arg";
import dotenv from "dotenv";
import pkg from "../package.json" assert { type: "json" };
import deployCommand from "../src/cli/deploy.js";
import devCommand from "../src/cli/dev.js";

// Credit to Next.js, which I largely ripped off for this

// Setup .env
const result = dotenv.config();
if (result.error) {
	throw result.error;
}

process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));

const commands: Record<string, (argv?: string[]) => void> = {
	dev: devCommand,
	deploy: deployCommand,
};

const args = arg(
	{
		"--version": Boolean,
		"--help": Boolean,
		"-v": "--version",
		"-h": "--help",
	},
	{
		permissive: true,
	}
);

if (args["--version"]) {
	console.log(`Interaction Kit v${pkg.version}`);
	process.exit(0);
}

const valid = args._[0] in commands;

if (!valid && args["--help"]) {
	console.log(`
    Usage
      $ ikit <command>

    Available commands
      ${Object.keys(commands).join(", ")}

			Options
      --version, -v   Version number
      --help, -h      Displays this message

			For more information run a command with the --help flag
      $ ikit dev --help
  `);
	process.exit(0);
}

const command = valid ? args._[0] : "dev";
const forwardedArgs = valid ? args._.slice(1) : args._;

if (args["--help"]) {
	forwardedArgs.push("--help");
}

process.env.NODE_ENV ??= command === "dev" ? "development" : "production";

commands[command]?.(forwardedArgs);
