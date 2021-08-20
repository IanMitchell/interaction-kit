import { SlashCommand } from "interaction-kit";

export default new SlashCommand({
	name: "ping",
	description: "Get a pong back",
	handler: (interaction) => {
		interaction.reply({ message: "pong", ephemeral: true });
	},
});
