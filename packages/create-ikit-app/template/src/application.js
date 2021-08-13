import path from "node:path";
import { Application } from "interaction-kit";

export default new Application({
	applicationID: process.env.APPLICATION_ID,
	publicKey: process.env.PUBLIC_KEY,
	token: process.env.TOKEN,
})
	.addCommandDirectory(path.join(process.cwd(), "./commands"))
	.addComponentDirectory(path.join(process.cwd(), "./components"))
	.addMenuDirectory(path.join(process.cwd(), "./menus"));

/**
 * If you'd like to run a custom server, uncomment below!
 * The below example is for a Vercel Serverless Function
 * Learn more: https://vercel.com/docs/serverless-functions/introduction
 */
// export function server(app) {
// 	return async (request, response) => {
// 		await app.ready();
// 		app.server.emit('request', request, response);
// 	}
// }
