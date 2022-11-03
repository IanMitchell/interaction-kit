import { Application } from "interaction-kit";
import PingCommand from "./commands/ping.js";

export default new Application({
	applicationId: process.env.APPLICATION_ID!,
	publicKey: process.env.PUBLIC_KEY!,
	token: process.env.TOKEN!,
}).addCommand(PingCommand);
