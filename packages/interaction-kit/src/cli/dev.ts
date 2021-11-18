import ngrok from "ngrok";
import chokidar from "chokidar";
import arg from "arg";
import { getApplicationEntrypoint } from "../scripts";

const CONFIG_FILES = [".env"];
const BOT_FILES = ["package.json", "src/*", "src/**/*"];

export default async function dev(argv?: string[]) {
	// Handle Help
	if (argv?.includes("--help")) {
		console.log(`
			Description
				Creates all new commands, updates all changed commands, and deletes all removed commands from Discord.

			Usage
				$ ikit deploy
  	`);
		process.exit(0);
	}

	// Parse input args
	const args = arg(
		{
			"--port": Number,
			"-p": "--port",
		},
		{
			permissive: true,
		}
	);

	const port = args["--port"] ?? 3000;

	// Start application
	let application = await getApplicationEntrypoint();
	let server = application.startServer();

	// Listen for config file changes and let user know they need to reload
	const configWatcher = chokidar.watch(CONFIG_FILES);
	configWatcher.on("change", (path) => {
		console.log(
			`Change detected in ${path} - please restart your application!`
		);
	});

	// Watch for changes requiring application reloads
	const botWatcher = chokidar.watch(BOT_FILES);
	botWatcher.on("change", async () => {
		console.log("Reloading application");

		// Reset server and watchers
		await server.close();

		// Reload the application
		application = await getApplicationEntrypoint();
		server = application.startServer();
	});

	// Start up ngrok tunnel to connect with
	console.log("Starting Tunnel...");

	const url = await ngrok.connect({
		addr: port,
		onLogEvent: (msg) => {
			console.log(`ngrok Log Event: ${msg}`);
		},
		onStatusChange: (status) => {
			console.log(`Status ${status}`);
		},
		onTerminated: () => {
			console.log("ngrok tunnel terminated");
		},
	});

	console.log(`URL: ${url}`);
	console.log("Add this as your test bot thing. More info: <url>");
}
