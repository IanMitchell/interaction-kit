import path from "node:path";
import { Application } from "interaction-kit";

export default new Application({
	applicationID: process.env.APPLICATION_ID,
	publicKey: process.env.PUBLIC_KEY,
	token: process.env.TOKEN,
})
	.addCommandDirectory(path.join(process.cwd(), "./commands"))
	.addComponentDirectory(process.cwd(), "./components");

/**
 * If you'd like to run a custom server, uncomment below!
 */
// export function server() {}
