import debug from "debug";
import { client } from "discord-api";
import type { APIInteraction } from "discord-api-types/v10";
import { ApplicationCommandType } from "discord-api-types/v10";
import type { Snowflake } from "discord-snowflake";
import isValidRequest from "discord-verify";
import type ContextMenu from "./commands/context-menu";
import type SlashCommand from "./commands/slash-command";
import type { ExecutableComponent } from "./components";
import { isExecutableComponent } from "./components";
import Config from "./config";
import * as Interaction from "./interactions";
import type ApplicationCommandInteraction from "./interactions/application-commands/application-command-interaction";
import type {
	InteractionKitCommand,
	MapValue,
	SerializableComponent,
} from "./interfaces";
import { response, ResponseStatus } from "./requests/response";

const log = debug("ikit:application");

type ApplicationArgs = {
	applicationId: string;
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
	#applicationId: Snowflake;
	#publicKey: string;
	#token: string;
	#commands: CommandMap;
	#components: Map<string, ExecutableComponent> = new Map();
	#shutdown: AbortController;

	constructor({ applicationId, publicKey, token }: ApplicationArgs) {
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

	addCommand(command: InteractionKitCommand<ApplicationCommandInteraction>) {
		if (this.#commands[command.type]?.has(command.name.toLowerCase())) {
			throw new Error(
				`Error registering ${command.name.toLowerCase()}: Duplicate names are not allowed`
			);
		}

		log(`Registering the ${command.name.toLowerCase()} command`);

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
	async handler(request: Request) {
		log("Handling Incoming Request");

		if (request.method !== "POST") {
			return response(ResponseStatus.MethodNotAllowed, {
				error: "Invalid Method",
			});
		}

		// TODO: Handle different platforms
		const valid = await isValidRequest(request, this.#publicKey);
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
					}
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
