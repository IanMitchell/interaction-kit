import { SlashCommand } from "interaction-kit";

export default new SlashCommand({
	name: "ping",
	description: "Get a pong back",
	handler: async (interaction) => {
		try {
			await interaction.reply({ message: "pong", ephemeral: true });
		} catch (err: unknown) {
			console.error("Error!");
		}
	},
});
