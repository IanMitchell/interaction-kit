/* eslint-disable no-await-in-loop */

import type { FastifyRequest, FastifyReply } from "fastify";

import dotenv from "dotenv";
import Command from "./command";
import Config from "./api/config";
import {
	InteractionCallbackType,
	Interaction as InteractionDefinition,
	InteractionRequestType,
	Snowflake,
} from "./definitions";
import * as Interaction from "./interactions";
import * as API from "./api";
import { Executable, SerializableComponent } from "./interfaces";
import startInteractionKitServer from "./server";

type ApplicationArgs = {
	applicationID: string;
	publicKey: string;
	token: string;
	port?: number;
};

dotenv.config();

// TODO: This should be moved... somewhere
function isExecutable(
	component: SerializableComponent | (SerializableComponent & Executable)
): component is SerializableComponent & Executable {
	return (component as SerializableComponent & Executable).handler != null;
}

export default class Application {
	#applicationID: Snowflake;
	#publicKey: string;
	#token: string;
	#commands: Map<string, Command>;
	#components: Map<string, SerializableComponent & Executable>;
	#port: number;

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

		this.#applicationID = applicationID as Snowflake;
		this.#publicKey = publicKey;
		this.#token = token as Snowflake;
		this.#commands = new Map<string, Command>();
		this.#components = new Map<string, SerializableComponent & Executable>();
		this.#port = port ?? 3000;

		// Configure API Defaults
		Config.setToken(this.#token);
		Config.setApplicationID(this.#applicationID);
	}

	get id() {
		return this.#applicationID;
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

	addComponent(component: SerializableComponent) {
		if (component.id != null && isExecutable(component)) {
			this.#components.set(component.id, component);
		}
	}

	// TODO: Should this be moved into Command?
	async updateCommands() {
		console.log("Checking for command updates in Development Server");

		if (!process.env.DEVELOPMENT_SERVER_ID) {
			throw new NoDevelopmentServerEnvironmentVariableError();
		}

		const guildID: Snowflake = process.env.DEVELOPMENT_SERVER_ID as Snowflake;
		const json = await API.getGuildApplicationCommands(guildID);

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
					await API.postGuildApplicationCommand(guildID, command.serialize());
				} catch (e: unknown) {
					console.error(`\tProblem updating ${command.name}`);
					console.error(e);
				}
			} else if (!command.equals(signature)) {
				console.log(`\tUpdating ${command.name}`);

				try {
					await API.patchGuildApplicationCommand(guildID, {
						...command.serialize(),
						application_id: this.#applicationID,
						id: signature.id,
					});
				} catch (e: unknown) {
					console.error(`\tProblem updating ${command.name}`);
					console.error(e);
				}
			}
		}

		console.log("Finished checking for updates");

		return this;
	}

	// LoadDirectory(path: string) {
	// TODO: Load all JS files from path
	// TODO: Create map of file/commandData
	// TODO: Create file listener on change
	// TODO: onChange, reload file and maybe emit command change events
	// }

	handler(
		request: FastifyRequest<{ Body: InteractionDefinition }>,
		response: FastifyReply
	) {
		console.log("REQUEST");
		const interaction = Interaction.create(this, request, response);

		switch (interaction.type) {
			case InteractionRequestType.PING:
				console.log("Handling Discord Ping");
				void response.send({
					type: InteractionCallbackType.PONG,
				});
				break;
			case InteractionRequestType.APPLICATION_COMMAND:
				if (this.#commands.has(interaction.name ?? "")) {
					console.log(`Handling ${interaction.name}`);
					return this.#commands
						.get(interaction.name)
						?.handler(interaction, this);
				}

				console.error(`Unknown Command: ${interaction.name ?? "[no name]"}`);
				void response.status(400).send({
					error: "Unknown Type",
				});
				break;
			case InteractionRequestType.MESSAGE_COMPONENT:
				if (this.#components.has(interaction.customID)) {
					console.log(`Handling Component ${interaction.customID}`);
					return this.#components
						.get(interaction.customID)
						?.handler(interaction, this);
				}

				console.error(
					`Unknown Component: ${interaction.customID ?? "[no custom id]"}`
				);
				void response.status(400).send({
					error: "Unknown Component",
				});
				break;
			default:
				console.error(`Unknown Type: ${request.body.type}`);
				break;
		}
	}

	startServer() {
		console.log("Starting server...");
		// TODO: Move this into a dev env check.
		void this.updateCommands();
		startInteractionKitServer(
			(...args) => this.handler(...args),
			this.#publicKey,
			this.#port
		);
	}
}

class NoDevelopmentServerEnvironmentVariableError extends Error {
	constructor() {
		super(
			"interaction-kit requires the environment variable DEVELOPMENT_SERVER_ID to update a single server's commands."
		);
	}
}
