import arg from "arg";
import inquirer from "inquirer";

process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));

const args = arg(
	{
		"--name": String,
		"--application_id": Number,
		"--public_key": String,
		"--token": String,
		"--development_server_id": Number,
		"--language": String,
		// "--platform": String,
		"--version": Boolean,
		"--help": Boolean,
		"-n": "--name",
		"-a": "--application_id",
		"-p": "--public_key",
		"-t": "--token",
		"-d": "--development_server_id",
		"-l": "--language",
		// "-p": "--platform",
		"-v": "--version",
		"-h": "--help",
	},
	{
		permissive: true,
	}
);

// TODO: Handle help
if (args["--version"]) {
	console.log(`Interaction Kit v${pkg.version}`);
	process.exit(0);
}

try {
	const inputs = await inquirer.prompt([
		{
			type: "input",
			name: "name",
			message: "Enter your bot's Name",
			validate: (input: string) => {
				return input != null;
			},
			when: () => args["--name"] == null,
		},
		{
			type: "input",
			name: "application_id",
			message: "Enter your bot's Application ID",
			validate: (input: string) => {
				return input != null;
			},
			when: () => args["--application_id"] == null,
		},
		{
			type: "input",
			name: "public_key",
			message: "Enter your bot's Public Key",
			validate: (input: string) => {
				return input != null;
			},
			when: () => args["--public_key"] == null,
		},
		{
			type: "input",
			name: "token",
			message: "Enter your bot's Token",
			validate: (input: string) => {
				return input != null;
			},
			when: () => args["--token"] == null,
		},
		{
			type: "input",
			name: "development_server_id",
			message: "Enter your Development Server ID",
			validate: (input: string) => {
				return input != null;
			},
			when: () => args["--development_server_id"] == null,
		},
		{
			type: "list",
			name: "language",
			message: "Select Language",
			choices: ["typescript", "javascript"],
			when: () => args["--language"] == null,
		},
		{
			type: "list",
			name: "platform",
			message: "Select Platform",
			choices: ["vercel"],
			when: () => false,
		},
	]);
} catch (error) {
	if (error.isTtyError) {
		// Prompt couldn't be rendered in the current environment
		// Output where to modify values
		console.log(
			"There was an error prompting for input. You will need to manually configure bot. Here's how: <url>"
		);
	} else {
		// Do something else, crash
		console.error(error);
		process.exit(1);
	}
}

const values = {
	name: args["--name"] ?? inputs.name,
	application_id: args["--application_id"] ?? inputs.application_id,
	public_key: args["--public_key"] ?? inputs.public_key,
	token: args["--token"] ?? inputs.token,
	development_server_id:
		args["--development_server_id"] ?? inputs.development_server_id,
	language: args["--language"] ?? inputs.language,
	// platform: args["--platform"] ?? inputs.platform,
};

// copy template files over

// insert values into template (only .env?)

// run npm `install interaction-kit`
