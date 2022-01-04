import { Button, ButtonStyle, Markdown } from "interaction-kit";

export default new Button({
	label: "Click me!",
	style: ButtonStyle.PRIMARY,
	handler: (interaction) => {
		interaction.reply({
			message: `${Markdown.user(interaction?.member?.user)} clicked me!`,
			ephemeral: true,
		});
	},
});
