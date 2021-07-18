import { Command } from "interaction-kit";

export default new Command({
	name: "ping",
	description: "Get a pong back",
	handler: (interaction) => {
		interaction.reply({ message: "pong", ephemeral: true });
	},
});
