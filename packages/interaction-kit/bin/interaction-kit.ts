#!/usr/bin/env node
import {Command} from 'commander';
import { createInterface as createPrompt } from 'readline';

const cli = new Command();
const prompt = createPrompt({
	input: process.stdin,
	output: process.stdout,
})

/* eslint-disable capitalized-comments,max-params */

// TODO: Make all these options optional
cli
	.command('new [name]')
	.option('--server <server>', 'An ID for your development server')
	.option('--token <token>')
	.option('--public_key <publicKey>')
	.option('--application_id <applicationID>')
	.description('Creates a new Interaction Kit project')
	.action(
		(
			name: string,
			server: string,
			token: string,
			publicKey: string,
			applicationID: string
		) => {
			console.log({
				name,
				server,
				token,
				publicKey,
				applicationID,
			});

			// TODO: for each non-set value, prompt the user for information
			// TODO: Scaffold the following structure:

			/**
      src/
      ├─ ping.js
      .gitignore
      .env
      package.json
      index.js
      README.md
     */
		}
	);

cli
	.command('dev')
	.description('Run your Interaction Kit application in a development mode')
	.action(() => {
		console.log('Unimplemented');
		// TODO: Load dotenv
		// TODO: Load from package.json "main" file
	});

interface DeployOptions {
	token?: string
	application_id?: string;
	commands?: string[];
	developer?: boolean | string;
}

cli
	.command("deploy")
	.option('-t, --token <token>', 'The bot token for your application')
	.option('-i, --application_id <applicationID>')
	.option('-c, --commands <files...>', 'The path(s) to the files which contain Interaction Kit Commands to be registered')
	.option('-d, --developer [guildID]', 'Run deployment in developer mode (register to a single guild)')
	.description("Deploy the commands for your Interaction Kit application")
	.action(async (options: DeployOptions) => {
		const { token, application_id, commands, developer } = options;
		console.log(options);
		// TODO: change type to Command[] and don't assign
		let retrievedCommands = '';
		if (commands == null) {
			// TODO: add validator and transformer to ensure commands are what we expect
			retrievedCommands = await getInput({ query: 'Please enter the path to the file(s) where your Interaction Kit Commands are stored'});
		}

		console.log(retrievedCommands);
		// TODO: check for token in env
		// TODO: check for guild id in env when running dev mode, prompt if not

		prompt.close();

		// TODO: do the actual thing
	});


cli.parse(process.argv);

// cli
//   .command("start")
//   .description("Run your Interaction Kit application in a production mode")
//   .action();

interface InputOptions<T = string> {
	query: string;
	transformer?: (input: string) => T
	validator?: (input: T | string) => boolean
}

async function getInput<T>(options: InputOptions<T> & { transformer: (input: string) => T } | InputOptions<T> & { transformer: (input: string) => T, validator: (input: T) => boolean }): Promise<T>
async function getInput(options: InputOptions | InputOptions & { validator: (input: string) => boolean }): Promise<string>
async function getInput<T = string>({ query, transformer, validator }: InputOptions<T>): Promise<T | string> {
	const response = await new Promise<string>(res => {
		prompt.question(`${query}: `, (input) => {
			res(input);
		});
	});
	let output: T | string = response;
	if (transformer != null) {
		output = transformer(response)
	}

	if (validator != null) {
		if (!validator(output)) {
			console.log('Please try again');
			if (transformer != null) {
				return getInput<T>({ query, transformer, validator });
			}

			return getInput({ query, validator });
		}
	}

	return output;
}
