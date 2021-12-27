import arg from "arg";

export default function command(argv?: string[]) {
	// Handle Help
	if (argv?.includes("--help")) {
		console.log(`
		Description
			Starts the production server

		Usage
			$ ikit start
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
}
