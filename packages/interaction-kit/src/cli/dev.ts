export default async function dev(argv?: string[]) {
	// get pkg.json
	// get main
	// import application
	// start server with args
	// start file listeners and watcher
	// start ngrok
}

async function dev() {
	let app: Application | null = null;

	try {
		const pkg = (
			await (import(path.join(process.cwd(), "package.json")) as Promise<{
				default: Record<string, unknown>;
			}>)
		).default;

		const appFile = pkg?.main as string;
		const appModule = (await import(
			path.join(process.cwd(), appFile)
		)) as Record<string, unknown>;
		app = appModule?.default as Application;
	} catch (error: unknown) {
		console.error(
			"There was an error finding your Application file! You can find out more info here <url>"
		);
		console.error(error);
	}

	if (app == null) {
		throw new Error("hm");
	}

	app.startServer();

	console.log("Starting Tunnel...");

	const url = await ngrok.connect({
		addr: port,
		onLogEvent: (msg) => {
			console.log(msg);
		},
		onStatusChange: (status) => {
			console.log(`Status ${status}`);
		},
		onTerminated: () => {
			console.log("Terminated");
		},
	});

	console.log(`URL: ${url}`);
	console.log("Add this as your test bot thing. More info: <url>");
}

// Watch config changes
if (command === "dev") {
	const { CONFIG_FILES } = require("../shared/lib/constants");
	const { watchFile } = require("fs");

	for (const CONFIG_FILE of CONFIG_FILES) {
		watchFile(`${process.cwd()}/${CONFIG_FILE}`, (cur: any, prev: any) => {
			if (cur.size > 0 || prev.size > 0) {
				console.log(
					`\n> Found a change in ${CONFIG_FILE}. Restart the server to see the changes in effect.`
				);
			}
		});
	}
}
