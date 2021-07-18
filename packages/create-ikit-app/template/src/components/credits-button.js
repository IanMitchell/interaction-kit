import { Button, ButtonStyle, Embed } from "interaction-kit";

export default new Button({
	label: "Bot Credits",
	customID: "credits",
	style: ButtonStyle.SECONDARY,
	handler: (event) => {
		void event.reply({
			embed: new Embed({
				title: "About This Bot",
				description: "Add information about your bot here!",
				fields: [
					{
						name: "Framework",
						value: "[Interaction Kit](https://interactionkit.dev)",
					},
				],
			}),
			ephemeral: true,
		});
	},
});
