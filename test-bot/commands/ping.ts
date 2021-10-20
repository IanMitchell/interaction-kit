import { SlashCommand } from "../../packages/interaction-kit/src";

export default new SlashCommand({
	name: "ping",
	description: "Get a pong back",
	handler: async (interaction) =>
		interaction.reply({ message: "pong", ephemeral: true }),
});
