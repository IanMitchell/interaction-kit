import path from "node:path";
import url from "node:url";
import { Application } from "interaction-kit";

const applicationDirectory = path.dirname(url.fileURLToPath(import.meta.url));

export default new Application({
	applicationID: process.env.APPLICATION_ID,
	publicKey: process.env.PUBLIC_KEY,
	token: process.env.TOKEN,
})
	.loadApplicationCommandDirectory(
		path.resolve(applicationDirectory, "./commands")
	)
	.loadMessageComponentDirectory(
		path.resolve(applicationDirectory, "./components")
	);
