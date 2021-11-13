#!/usr/bin/env node
import arg from "arg";
import devCommand from "../src/cli/dev";
import deployCommand from "../src/cli/deploy";
import startCommand from "../src/cli/start";

// Credit to Next.js, which I largely ripped off for this

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
const pkg = require("../package.json") as Record<string, unknown>;

process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));

const commands: Record<string, (argv?: string[]) => void> = {
	dev: devCommand,
	deploy: deployCommand,
	start: startCommand,
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
	// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
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

// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
commands[command]?.(forwardedArgs);
