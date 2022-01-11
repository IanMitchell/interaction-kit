import type { FastifyRequest, FastifyReply } from "fastify";

import fs from "node:fs";
import path from "node:path";
import SlashCommand from "./commands/slash-command";
import ContextMenu from "./commands/context-menu";
import Config from "./api/config";
import {
	Interaction as InteractionDefinition,
	Snowflake,
	ApplicationCommandType,
} from "./definitions";
import * as Interaction from "./interactions";
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
			console.log(`Registering the ${component.id} component`);
			this.#components.set(component.id, component);
		}

		return this;
	}

	getComponent(customID: string) {
		return this.#components.get(customID);
	}

	getCommand(type: ApplicationCommandType, name: string) {
		return this.#commands.get(type).get(name);
	}

	loadApplicationCommandDirectory(directory: string) {
		console.log(`Loading Application Commands from ${directory}`);

		fs.readdir(directory, async (err, files) => {
			if (err) {
				throw err;
			}

			console.log(`\tLoading ${files.length} files`);
			for (const file of files) {
				if (file.endsWith(".js")) {
					const command = await import(path.join(directory, file));
					this.addCommand(command.default);
				}
			}
		});

		return this;
	}

	loadMessageComponentDirectory(directory: string) {
		console.log(`Loading Message Components from ${directory}`);

		fs.readdir(directory, async (err, files) => {
			if (err) {
				throw err;
			}

			console.log(`\tLoading ${files.length} files`);
			for (const file of files) {
				if (file.endsWith(".js")) {
					const component = await import(path.join(directory, file));
					this.addComponent(component.default);
				}
			}
		});

		return this;
	}

	handler(
		request: FastifyRequest<{ Body: InteractionDefinition }>,
		response: FastifyReply
	) {
		console.log("REQUEST");
		try {
			Interaction.handler(this, request, response);
		} catch (exception: unknown) {
			console.log(exception);
			void response.status(400).send({
				error: "Unknown Type",
			});
			throw exception;
		}
	}

	async startServer(port?: number) {
		return startInteractionKitServer(
			(...args) => {
				this.handler(...args);
			},
			this.#publicKey,
			port ?? this.#port
		);
	}
}
