import { Application } from "../packages/interaction-kit/src";
import PingCommand from "./commands/ping.js";

// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
export default new Application({
	applicationID: process.env.APPLICATION_ID!,
	publicKey: process.env.PUBLIC_KEY!,
	token: process.env.TOKEN!,
})
	.addCommand(PingCommand)
	.startServer();
