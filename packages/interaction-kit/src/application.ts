import debug from "debug";
import { client } from "discord-api-methods";
import type { APIInteraction } from "discord-api-types/v10";
import { ApplicationCommandType } from "discord-api-types/v10";
import type { Snowflake } from "discord-snowflake";
import { isValidRequest } from "discord-verify";
import type ContextMenu from "./commands/context-menu.js";
import type SlashCommand from "./commands/slash-command.js";
import type { ExecutableComponent } from "./components/index.js";
import { isExecutableComponent } from "./components/index.js";
import Config from "./config.js";
import * as Interaction from "./interactions/index.js";
import type { MapValue, SerializableComponent } from "./interfaces.js";
import { response, ResponseStatus } from "./requests/response.js";

const log = debug("ikit:application");

type ApplicationArgs = {
	applicationId: string;
	publicKey: string;
	token: string;
	platform: SubtleCryptoImportKeyAlgorithm | string;
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

export type AllCommands =
	| SlashCommand
	| ContextMenu<ApplicationCommandType.User>
	| ContextMenu<ApplicationCommandType.Message>;

export default class Application {
	#applicationId: Snowflake;
	#publicKey: string;
	#token: string;
	#commands: CommandMap;
	#components = new Map<string, ExecutableComponent>();
	#shutdown: AbortController;
	#platform: SubtleCryptoImportKeyAlgorithm | string;

	constructor({ applicationId, publicKey, token, platform }: ApplicationArgs) {
		if (!applicationId) {
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

		this.#applicationId = applicationId as Snowflake;
		this.#publicKey = publicKey;
		this.#token = token as Snowflake;
		this.#shutdown = new AbortController();
		this.#platform = platform;

		// Set up internal data structures
		this.#commands = {
			[ApplicationCommandType.ChatInput]: new Map(),
			[ApplicationCommandType.Message]: new Map(),
			[ApplicationCommandType.User]: new Map(),
		};

		// Configure API Defaults
		Config.setApplicationId(this.#applicationId);
		client.setToken(this.#token);
		client.abortSignal = this.#shutdown.signal;
	}

	get id() {
		return this.#applicationId;
	}

	get commands() {
		return Object.values(this.#commands)
			.map((map) => [...map.values()])
			.flat();
	}

	addCommand(command: AllCommands) {
		if (this.#commands[command.type]?.has(command.name.toLowerCase())) {
			throw new Error(
				`Error registering ${command.name.toLowerCase()}: Duplicate names are not allowed`
			);
		}

		log(`Adding the ${command.name.toLowerCase()} command`);

		this.#commands[command.type].set(
			command.name.toLowerCase(),
			// TypeScript constraint due to command being all possible command types, it's difficult to type tersely
			// https://canary.discord.com/channels/508357248330760243/746364189710483546/900780684690485300
			command as never
		);

		return this;
	}

	addCommands(...commands: AllCommands[]) {
		commands.forEach((command) => this.addCommand(command));
		return this;
	}

	getCommand<T extends ApplicationCommandType>(
		type: T,
		name: string
	): CommandMapValue<T> | undefined {
		// I'm not sure why, but this needs to be cast to prevent an error
		return this.#commands[type].get(name) as CommandMapValue<T> | undefined;
	}

	addComponent(component: SerializableComponent) {
		if (
			isExecutableComponent(component) &&
			component.id != null &&
			!this.#components.has(component.id)
		) {
			log(`Registering the ${component.id} component`);
			this.#components.set(component.id, component);
		}

		return this;
	}

	getComponent(customId: string) {
		return this.#components.get(customId);
	}

	async findComponent(customId: string) {
		for (const component of this.#components.values()) {
			const match = await component.matches?.(customId);
			if (match) {
				return component;
			}
		}

		return undefined;
	}

	// TODO: This is convoluted and doesn't really work. We need to return
	// two states; one promise should resolve to the current response,
	// and the second should resolve to "all the work is done, we can end the process".
	// This will be important for serverless and worker environments
	async handler(request: Request): Promise<Response> {
		log("Handling Incoming Request");

		if (request.method !== "POST") {
			return response(ResponseStatus.MethodNotAllowed, {
				error: "Invalid Method",
			});
		}

		const valid = await isValidRequest(
			request,
			this.#publicKey,
			this.#platform
		);
		if (!valid) {
			return response(ResponseStatus.Unauthorized, {
				error: "Invalid Request",
			});
		}

		try {
			const json = await request.json<APIInteraction>();

			return await new Promise((resolve) => {
				void Interaction.handler(
					this,
					json,
					(status: ResponseStatus, json: Record<string, any>) => {
						resolve(response(status, json));
					},
					request
				);
			});
		} catch (error: unknown) {
			log((error as Error).message);
			return response(ResponseStatus.BadRequest, { error: "Unknown Type" });
		}
	}

	shutdown() {
		this.#shutdown.abort();
	}
}
