import { Command } from "interaction-kit";


function getInviteLink(application) {
  return `https://discord.com/oauth2/authorize?client_id=${application.#applicationID}&scope=applications.commands`;
}

export default new Command({
  name: "invite",
  description: "Get an invite link to add the bot to your server",
  handler: (interaction, application) => {
    interaction.reply({
      message: `[Click here to invite me](${getInviteLink(application)})`,
      ephemeral: true
    });
  }
});
