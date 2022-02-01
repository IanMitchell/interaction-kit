import { ActionRow, SlashCommand } from "interaction-kit";
import MyButton from "../components/my-button";

export default new SlashCommand({
	name: "button",
	description: "Click a button!",
	handler: (interaction) => {
		interaction.reply({
			message: "Click me!",
			components: [new ActionRow(MyButton)],
		});
	},
});
