/* eslint-disable no-await-in-loop */

import dotenv from "dotenv";
import fastify, {
	FastifyInstance,
	FastifyRequest,
	FastifyReply,
} from "fastify";
import rawBody from "fastify-raw-body";
import Command from "./command";
import {
	InteractionCallbackType,
	ApplicationCommand,
	Interaction as IInteraction,
	InteractionType,
} from "./definitions";
import { validateRequest } from "./requests/validate";
import Interaction from "./interaction";
import APIClient from "./requests/client";

type ApplicationArgs = {
	applicationID: string;
	publicKey: string;
	token: string;
	port?: number;
};

type ServerCallback = (
	app: FastifyInstance
) => (request: FastifyRequest, response: FastifyReply) => unknown;

dotenv.config();

export default class Application {
	#applicationID;
	#publicKey;
	#token;
	#commands;
	#port;
	apiClient: APIClient;

	constructor({ applicationID, publicKey, token, port }: ApplicationArgs) {
		if (!applicationID) {
			throw new Error(
				"Please provide an Application ID. You can find this value <here>"
			);
		}

		if (!publicKey) {
			throw new Error(
				"Please provide a Public Key. You can find this value <here>"
			);
		}

		if (!token) {
			throw new Error("Please provide a Token. You can find this value <here>");
		}

		this.#applicationID = applicationID;
		this.#publicKey = publicKey;
		this.#token = token;
		this.#commands = new Map<string, Command>();
		this.#port = port ?? 3000;
		this.apiClient = new APIClient(this.#token);
	}

	addCommand(command: Command) {
		if (this.#commands.has(command.name.toLowerCase())) {
			throw new Error(
				`Error registering ${command.name.toLowerCase()}: Duplicate names are not allowed`
			);
		}

		console.log(`Registering the ${command.name.toLowerCase()} command`);
		this.#commands.set(command.name.toLowerCase(), command);
		return this;
	}

	addCommands(...commands: Command[]) {
		commands.forEach((command) => this.addCommand(command));
		return this;
	}

	// TODO: Should this be moved into Command?
	async updateCommands() {
		console.log("Updating Commands in Development Server");

		if (!process.env.DEVELOPMENT_SERVER_ID) {
			throw new NoDevelopmentServerEnvironmentVariableError();
		}

		// TODO: Move this into an API module
		// (also, an example of using the api client)
		const json = (await this.apiClient.get(
			`/applications/${this.#applicationID}/guilds/${
				process.env.DEVELOPMENT_SERVER_ID
			}/commands`
		)) as ApplicationCommand[];

		// TODO: Handle errors
		/**
		 * Not in development server:
		 *  { message: 'Missing Access', code: 50001 }
		 */

		for (const [name, command] of this.#commands) {
			const signature = json.find((cmd) => cmd.name === name);

			if (!signature) {
				console.log(`\tCreating ${name}`);

				try {
					await this.apiClient.post(
						`/applications/${this.#applicationID}/guilds/${
							process.env.DEVELOPMENT_SERVER_ID
						}/commands`,
						command.serialize()
					);
				} catch (e: unknown) {
					console.error(`\tProblem updating ${command.name}`);
					console.error(e);
				}
			} else if (!command.equals(signature)) {
				console.log(`\tUpdating ${command.name}`);

				try {
					await this.apiClient.patch(
						`/applications/${this.#applicationID}/guilds/${
							process.env.DEVELOPMENT_SERVER_ID
						}/commands/${signature.id}`,
						command.serialize()
					);
				} catch (e: unknown) {
					console.error(`\tProblem updating ${command.name}`);
					console.error(e);
				}
			}
		}

		return this;
	}

	// LoadDirectory(path: string) {
	// TODO: Load all JS files from path
	// TODO: Create map of file/commandData
	// TODO: Create file listener on change
	// TODO: onChange, reload file and maybe emit command change events
	// }

	startServer(callback?: ServerCallback) {
		console.log("Starting server...");
		const server = fastify();

		void server.register(rawBody, {
			runFirst: true,
		});

		server.addHook("preHandler", async (request, response) => {
			if (request.method === "POST") {
				if (!validateRequest(request, this.#publicKey)) {
					console.log("Invalid Discord Request");
					return response.status(401).send({ error: "Bad request signature " });
				}
			}
		});

		server.post<{ Body: IInteraction }>("/", async (request, response) => {
			console.log("REQUEST");
			const interaction = new Interaction(request, response);

			if (!interaction || interaction.type === InteractionType.PING) {
				console.log("Handling Discord Ping");
				void response.send({
					type: InteractionCallbackType.PONG,
				});
			} else if (interaction.type === InteractionType.APPLICATION_COMMAND) {
				if (!interaction.name) {
					console.error(
						`Received Command but with no name: ${JSON.stringify({
							type: interaction.type,
							name: interaction.name,
						})}`
					);

					return;
				}

				if (this.#commands.has(interaction.name)) {
					console.log(`Handling ${interaction.name}`);
					return this.#commands
						.get(interaction.name)
						?.handler(interaction, this);
				}

				console.error(`Unknown Command: ${interaction.name}`);
				void response.status(400).send({
					error: "Unknown Type",
				});
			} else {
				// TODO: figure out what would lead to this state, and how to handle it.
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				console.error(`Unknown Type: ${interaction.type}`);
			}
		});

		if (callback) {
			callback(server);
		} else {
			server.listen(this.#port, async (error, address) => {
				if (error) {
					console.error(error);
					process.exit(1);
				}

				console.log(`Server listening on ${address}`);
			});
		}

		// TODO: Move this into a dev env check.
		void this.updateCommands();
	}
}

class NoDevelopmentServerEnvironmentVariableError extends Error {
	constructor() {
		super(
			"interaction-kit requires the environment variable DEVELOPMENT_SERVER_ID to update a single server's commands."
		);
	}
}
