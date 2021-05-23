import { Command } from 'interaction-kit';

const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${process.env.APPLICATION_ID}&scope=applications.commands`;

export default new Command({
  name: 'invite',
  description: 'Get an invite link to add the bot to your server',
  handler: interaction => {
    interaction.reply(`[Click here to invite me](${INVITE_URL})`, {
      ephemeral: true,
    });
  },
});
