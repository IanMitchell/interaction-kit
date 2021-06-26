#!/usr/bin/env node
import {Command} from 'commander';

const cli = new Command();

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

cli.parse(process.argv);

// cli
//   .command("deploy")
//   .description("Deploy your Interaction Kit application")
//   .action();

// cli
//   .command("start")
//   .description("Run your Interaction Kit application in a production mode")
//   .action();
