/* eslint-disable no-await-in-loop */

import type { FastifyRequest, FastifyReply } from "fastify";

import dotenv from "dotenv";
import SlashCommand from "./commands/slash-command";
import ContextMenu from "./commands/context-menu";
import Config from "./api/config";
import {
	Interaction as InteractionDefinition,
	Snowflake,
	ApplicationCommandType,
} from "./definitions";
import * as Interaction from "./interactions";
import * as API from "./api";
import { InteractionKitCommand, SerializableComponent } from "./interfaces";
import startInteractionKitServer from "./server";
import ApplicationCommandInteraction from "./interactions/application-commands/application-command-interaction";
import { ExecutableComponent, isExecutableComponent } from "./components";

type ApplicationArgs = {
	applicationID: string;
	publicKey: string;
	token: string;
	port?: number;
};

dotenv.config();

export interface CommandMap
	extends Map<
		ApplicationCommandType,
		Map<
			string,
			| SlashCommand
			| ContextMenu<ApplicationCommandType.MESSAGE>
			| ContextMenu<ApplicationCommandType.USER>
		>
	> {
	get(key: ApplicationCommandType.CHAT_INPUT): Map<string, SlashCommand>;
	get(
		key: ApplicationCommandType.MESSAGE
	): Map<string, ContextMenu<ApplicationCommandType.MESSAGE>>;
	get(
		key: ApplicationCommandType.USER
	): Map<string, ContextMenu<ApplicationCommandType.USER>>;
	get(
		key: ApplicationCommandType
	): Map<string, InteractionKitCommand<ApplicationCommandInteraction>>;
}

export default class Application {
	#applicationID: Snowflake;
	#publicKey: string;
	#token: string;
	#commands: CommandMap;

	#components: Map<string, ExecutableComponent> = new Map();
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
		this.#port = port ?? 3000;

		// Set up internal data structures
		this.#commands = new Map([
			[ApplicationCommandType.CHAT_INPUT, new Map()],
			[ApplicationCommandType.MESSAGE, new Map()],
			[ApplicationCommandType.USER, new Map()],
		]) as CommandMap;

		// Configure API Defaults
		Config.setToken(this.#token);
		Config.setApplicationID(this.#applicationID);
	}

	get id() {
		return this.#applicationID;
	}

	get commands() {
		return Array.from(this.#commands.values())
			.map((map) => Array.from(map.values()))
			.flat();
	}

	addCommand(command: InteractionKitCommand<ApplicationCommandInteraction>) {
		if (this.#commands.get(command.type)?.has(command.name.toLowerCase())) {
			throw new Error(
				`Error registering ${command.name.toLowerCase()}: Duplicate names are not allowed`
			);
		}

		console.log(`Registering the ${command.name.toLowerCase()} command`);
		this.#commands.get(command.type)?.set(command.name.toLowerCase(), command);
		return this;
	}

	addCommands(
		...commands: Array<InteractionKitCommand<ApplicationCommandInteraction>>
	) {
		commands.forEach((command) => this.addCommand(command));
		return this;
	}

	addComponent(component: SerializableComponent) {
		if (
			isExecutableComponent(component) &&
			component.id != null &&
			!this.#components.has(component.id)
		) {
			this.#components.set(component.id, component);
		}

		return this;
	}

	getComponent(customID: string) {
		return this.#components.get(customID);
	}

	getCommand(type: ApplicationCommandType, id: Snowflake) {
		return this.#commands.get(type).get(id);
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

		const allCommands = Array.from(this.#commands.values())
			.map((map) => Array.from(map.values()))
			.flat();

		for (const command of allCommands) {
			const signature = json.find((cmd) => cmd.name === command.name);

			if (!signature) {
				console.log(`\tCreating ${command.name}`);

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
		try {
			Interaction.handler(this, request, response);
		} catch (exception: unknown) {
			void response.status(400).send({
				error: "Unknown Type",
			});
			throw exception;
		}
	}

	startServer() {
		console.log("Starting server...");
		// TODO: Move this into a dev env check.
		void this.updateCommands();
		return startInteractionKitServer(
			(...args) => {
				this.handler(...args);
			},
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
