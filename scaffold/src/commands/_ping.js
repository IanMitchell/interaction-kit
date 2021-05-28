import { Command } from "interaction-kit";

export default new Command({
  name: "ping",
  description: "Get a pong back",
  handler: interaction => {
    console.log("TestPing!");
    interaction.reply({ message: "pong", ephemeral: true });
  }
});
