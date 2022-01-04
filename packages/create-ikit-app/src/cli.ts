#!/usr/bin/env node

import { create } from "create-create-app";
import { resolve } from "path";

const templateRoot = resolve(__dirname, "..", "templates");

void create("create-ikit-app", {
	templateRoot,
	promptForTemplate: true,
	extra: {
		template: {
			type: "list",
			describe: "template",
			default: "JavaScript",
			prompt: "if-no-arg",
			choices: ["JavaScript", "TypeScript"],
		},
		applicationID: {
			type: "input",
			describe: "Enter your bot's Application ID",
			prompt: "if-no-arg",
		},
		publicKey: {
			type: "input",
			describe: "Enter your bot's Public Key",
			prompt: "if-no-arg",
		},
		token: {
			type: "input",
			describe: "Enter your bot's Token",
			prompt: "if-no-arg",
		},
		developmentServerID: {
			type: "input",
			describe: "Enter your Development Server ID",
			prompt: "if-no-arg",
		},
		platform: {
			type: "list",
			describe: "Select Platform",
			choices: ["vercel"],
			prompt: "if-no-arg",
		},
		// Disable default prompts
		description: {
			type: "input",
			describe: "description",
			prompt: "never",
		},
		author: {
			type: "input",
			describe: "No",
			prompt: "never",
		},
		email: {
			type: "input",
			describe: "author email",
			prompt: "never",
		},
		license: {
			type: "list",
			describe: "license",
			choices: ["UNLICENSED"],
			prompt: "never",
		},
	},
	after: ({ answers, installNpmPackage }) => {
		console.log(answers);
	},
	caveat: "Created your app!",
});
