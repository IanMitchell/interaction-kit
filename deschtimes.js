// index.js
import {Application} from 'interaction-kit';

new Application({
	applicationID: process.env.APPLICATION_ID,
	publicKey: process.env.PUBLIC_KEY,
	token: process.env.TOKEN,
})
	.loadDirectory('/commands')
	// .startServer() // localhost:3000
	// custom server, passed a fastify app (for vercel:)
	.startServer(app => {
		return async (req, res) => {
			await app.ready();
			app.server.emit('request', req, res);
		};
	});

// commands/cmd.js
import {Command, Embed} from 'interaction-kit';

export const command = new Command({
	name: 'deschtimes',
	description: 'Interact with the Deschtimes tracking system',
})
	.subcommand({
		name: 'list',
		description: 'Get a list of all active shows',
		handler: async interaction => {
			const embed = new Embed({
				// ...
			});

			interaction.reply(embed, {ephemeral: true});
		},
	})
	.subcommand({
		name: 'status',
		description: 'Check the current status of a show',
		options: [new StringInput('name', 'description', true)],
		handler: async interaction => {
			const value = interaction.options.name;

			const embed = new Embed({
				// ...
			});

			interaction.reply(embed);
		},
	})
	.group({
		name: 'mark',
		description: 'Mark your progress as complete or incomplete',
		commands: [new Subcommand()], // this feels like it could be
	});
