import { Application } from "interaction-kit";

export default new Application({
	applicationID: process.env.APPLICATION_ID,
	publicKey: process.env.PUBLIC_KEY,
	token: process.env.TOKEN,
})
	.loadApplicationCommandDirectory("./commands")
	.loadComponentDirectory("./components");
