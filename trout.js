import { Application, Command } from 'interaction-kit';

export default new Application({
  applicationID: process.env.APPLICATION_ID,
  publicKey: process.env.PUBLIC_KEY,
  token: process.env.TOKEN,
})
  .addCommand(
    new Command({
      name: 'invite',
      description: 'Get an invite link to add the bot to your server',
      handler: interaction => {
        interaction.reply(INVITE_URL, { ephemeral: true });
      },
    })
  )
  .addCommand(
    new Command({
      name: 'support',
      description: 'Like this bot? Support me!',
      handler: interaction => {
        interaction.reply(
          `"Thanks for using my bot! Let me know what you think on twitter (@IanMitchel1). If you'd like to contribute to hosting costs, you can donate at https://github.com/sponsors/ianmitchell"`,
          { ephemeral: true }
        );
      },
    })
  )
  .addCommand(
    new Command({
      name: 'slap',
      description: 'Sometimes you gotta slap a person with a large trout',
      options: [new UserInput('user', 'the user to slap', true)],
      handler: interaction => {
        interaction.reply(
          `*<@${interaction.user.id}> slaps <@${message.inputs.user}> around a bit with a large trout*`
        );
      },
    })
  )
  .startServer();
