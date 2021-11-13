import chokidar from "chokidar";
import arg from "arg";

const CONFIG_FILES = [".env"];

export default async function dev(argv?: string[]) {
	if (argv?.includes("--help")) {
		console.log(`
			Description
				Creates all new commands, updates all changed commands, and deletes all removed commands from Discord.

			Usage
				$ ikit deploy
  	`);
		process.exit(0);
	}

	// parse port

	// get application
	// start server (how?)

	// listen on config files [.env]
	const configWatcher = chokidar.watch(CONFIG_FILES);
	configWatcher.on("change", (path) => {
		console.log(
			`Change detected in ${path} - please restart your application!`
		);
	});

	/**
	 * On change, alert user to restart service (is there a way to do this without ngrok)
	 */
	// listen on bot files [package.json, src/application.{js,ts}]
	/**
	 * On change, reload entire application and bot
	 */
	// listen to command and component changes
	/**
	 * On change, unregister command/component, and reload file.
	 * If command, compare to old command. If changed, reregister with Discord
	 */

	// start ngrok
	// console.log("Starting Tunnel...");

	// const url = await ngrok.connect({
	// 	addr: port,
	// 	onLogEvent: (msg) => {
	// 		console.log(msg);
	// 	},
	// 	onStatusChange: (status) => {
	// 		console.log(`Status ${status}`);
	// 	},
	// 	onTerminated: () => {
	// 		console.log("Terminated");
	// 	},
	// });

	// console.log(`URL: ${url}`);
	// console.log("Add this as your test bot thing. More info: <url>");
	// create tunnel
	// output tunnel
}
