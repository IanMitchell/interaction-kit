import { ActionRow, Button, Command } from "interaction-kit";
import creditsButton from "../components/credits-button";

function getInviteLink(application) {
	return `https://discord.com/oauth2/authorize?client_id=${application.id}&scope=bot%20applications.commands`;
}

export default new Command({
	name: "invite",
	description: "Get an invite link to add this bot to your server",
	handler: (interaction, application) => {
		interaction.reply({
			message: `Click the button below to add me to your server!`,
			components: [
				new ActionRow(
					new Button({ url: getInviteLink(application), label: "Add me!" }),
					creditsButton
				),
			],
			ephemeral: true,
		});
	},
});
