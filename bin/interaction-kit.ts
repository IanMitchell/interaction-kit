#!/usr/bin/env node
import prompts from "prompts";
import arg from "arg";
import fs from "fs";
import path from 'path';
import copy from 'copy-template-dir';


async function create(name) {
  const questions = [
    {
      type: "text",
      name: "projectID",
      message: "Application ID?"
    },
    {
      type: "text",
      name: "publicKey",
      message: "Public Key?"
    }
    {
      type: "text",
      name: "token",
      message: "Token?"
    }
    {
      type: "text",
      name: "devServerID",
      message: "Development Server ID?"
    }
  ];

  const promptName = name == null || fs.existsSync(path.join(process.cwd(), name));

  const response = await prompts(
    promptName
      ? [
          {
            type: "text",
            name: "name",
            message: "Project Name?",
            validate: value => fs.existsSync(path.join(process.cwd(), value)) ? "A folder with that name already exists" : true
          }
        ].concat(questions)
      : questions
  );

  // TODO: Parse response into variables, add version, and run `copy`
  console.log({ response });
}

process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));

const commands = {
  new: "",
  dev: "",
  deploy: "",
  start: ""
};

const args = arg(
  {
    "--version": Boolean,
    "-v": "--version",

    "--help": Boolean,
    "-h": "--help"
  },
  { permissive: true }
);

const command = args._[0];

console.log({ args, command })

if (args["--version"]) {
  console.log("Not verison 1, I'll tell ya that one for free buddy");
}

if (args["--help"] && !(command in commands)) {
  // TODO: General help
  console.log("Help")
}

if (command === "new") {
  console.log({ args })
  create(args._[1]);
} else {
  console.log('No')
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
