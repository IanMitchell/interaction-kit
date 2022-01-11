import ngrok from "ngrok";
import chokidar from "chokidar";
import arg from "arg";
import spawn from "cross-spawn";
import { ChildProcess } from "child_process";

const CONFIG_FILES = [".env"];
const BOT_FILES = ["package.json", "src/**/*"];

export default async function dev(argv?: string[]) {
	// Handle Help
	if (argv?.includes("--help")) {
		console.log(`
			Description
				Creates all new commands, updates all changed commands, and deletes all removed commands from Discord.

			Usage
				$ ikit dev [-p <port>]
  	`);
		process.exit(0);
	}

	if (!process.env.DEVELOPMENT_SERVER_ID) {
		console.error("Missing `DEVELOPMENT_SERVER_ID` env variable. <link>");
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
	let child: ChildProcess | null = null;

	// Listen for config file changes and let user know they need to reload
	const configWatcher = chokidar.watch(CONFIG_FILES, {
		ignoreInitial: true,
	});
	configWatcher.on("change", (path) => {
		console.log(
			`Change detected in ${path} - please restart your application!`
		);
	});

	// Watch for changes requiring application reloads
	const botWatcher = chokidar.watch(BOT_FILES, {
		// ignoreInitial: true,
	});
	const handler = async () => {
		console.log("Reloading application");

		child?.kill();
		child = spawn("ikit", ["server", "-p", port.toString()], {
			stdio: "inherit",
		});
	};

	botWatcher.on("change", (path) => {
		console.log(`${path} changed, reloading`);
		void handler();
	});
	botWatcher.on("add", (path) => {
		console.log(`${path} was added, reloading`);
		console.log(path);
		void handler();
	});
	botWatcher.on("unlink", (path) => {
		console.log(`${path} was removed, reloading`);
		void handler();
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
		onTerminated: async () => {
			console.log("ngrok tunnel terminated");

			// Cleanup
			child?.kill();
			process.exit(0);
		},
	});

	console.log(`ngrok tunnel started for http://localhost:${port}\n${url}`);
	console.log("Add this as your test bot thing. More info: <url>");
}
