import fs from "node:fs";
import path from "node:path";
import SlashCommand from "./commands/slash-command";
import ContextMenu from "./commands/context-menu";
import Config from "./api/config";
import * as Interaction from "./interactions";
import {
	FetchEvent,
	InteractionKitCommand,
	SerializableComponent,
	Module,
	MapValue,
} from "./interfaces";
import type { Snowflake } from "./structures/snowflake";
import ApplicationCommandInteraction from "./interactions/application-commands/application-command-interaction";
import { ExecutableComponent, isExecutableComponent } from "./components";
import { response, ResponseStatus } from "./requests/response";
import { APIInteraction, ApplicationCommandType } from "discord-api-types/v9";
import { isValidRequest } from "./requests/validate";

type ApplicationArgs = {
	applicationID: string;
	publicKey: string;
	token: string;
};

type CommandMap = {
	[ApplicationCommandType.ChatInput]: Map<string, SlashCommand>;
	[ApplicationCommandType.Message]: Map<
		string,
		ContextMenu<ApplicationCommandType.Message>
	>;
	[ApplicationCommandType.User]: Map<
		string,
		ContextMenu<ApplicationCommandType.User>
	>;
};

type CommandMapValue<K extends keyof CommandMap> = MapValue<CommandMap[K]>;

export default class Application {
	#applicationID: Snowflake;
	#publicKey: string;
	#token: string;
	#commands: CommandMap;
	#components: Map<string, ExecutableComponent> = new Map();

	constructor({ applicationID, publicKey, token }: ApplicationArgs) {
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

		// Set up internal data structures
		this.#commands = {
			[ApplicationCommandType.ChatInput]: new Map<string, SlashCommand>(),
			[ApplicationCommandType.Message]: new Map<
				string,
				ContextMenu<ApplicationCommandType.Message>
			>(),
			[ApplicationCommandType.User]: new Map<
				string,
				ContextMenu<ApplicationCommandType.User>
			>(),
		} as const;

		// Configure API Defaults
		Config.setToken(this.#token);
		Config.setApplicationID(this.#applicationID);
	}

	get id() {
		return this.#applicationID;
	}

	get commands() {
		return Object.values(this.#commands)
			.map((map) => [...map.values()])
			.flat();
	}

	addCommand(command: InteractionKitCommand<ApplicationCommandInteraction>) {
		if (this.#commands[command.type]?.has(command.name.toLowerCase())) {
			throw new Error(
				`Error registering ${command.name.toLowerCase()}: Duplicate names are not allowed`
			);
		}

		console.log(`Registering the ${command.name.toLowerCase()} command`);

		this.#commands[command.type].set(
			command.name.toLowerCase(),
			// TypeScript constraint due to command being all possible command types, it's difficult to type tersely
			// https://canary.discord.com/channels/508357248330760243/746364189710483546/900780684690485300
			command as never
		);

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

	getCommand<T extends keyof CommandMap>(
		type: T,
		name: string
	): CommandMapValue<T> | undefined {
		// I'm not sure why, but this needs to be cast to prevent an error
		return this.#commands[type].get(name) as CommandMapValue<T> | undefined;
	}

	getGenericCommand(
		type: ApplicationCommandType,
		name: string
	): InteractionKitCommand<ApplicationCommandInteraction> | undefined {
		// I'm not sure why, but this needs to be cast to prevent an error
		return this.#commands[type].get(name) as
			| InteractionKitCommand<ApplicationCommandInteraction>
			| undefined;
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
					const command = (await import(path.join(directory, file))) as Module<
						InteractionKitCommand<ApplicationCommandInteraction>
					>;
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
					const component = (await import(
						path.join(directory, file)
					)) as Module<SerializableComponent>;
					this.addComponent(component.default);
				}
			}
		});

		return this;
	}

	async handler(event: FetchEvent) {
		console.log("REQUEST");

		if (event.request.method !== "POST") {
			await event.respondWith(
				response(ResponseStatus.MethodNotAllowed, { error: "Invalid Method" })
			);
			return;
		}

		const valid = await isValidRequest(event.request, this.#publicKey);
		if (!valid) {
			await event.respondWith(
				response(ResponseStatus.Unauthorized, { error: "Invalid Request" })
			);
			return;
		}

		try {
			const json = (await event.request.json()) as APIInteraction;
			Interaction.handler(
				this,
				json,
				async (status: ResponseStatus, json: Record<string, any>) => {
					void event.respondWith(response(status, json));
				}
			);
		} catch (exception: unknown) {
			console.log(exception);
			return response(ResponseStatus.BadRequest, { error: "Unknown Type" });
		}
	}
}
