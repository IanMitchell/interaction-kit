import type {
	APIApplicationCommandInteractionDataBasicOption,
	APIChatInputApplicationCommandInteraction,
} from "discord-api-types/v10";
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
} from "discord-api-types/v10";
import type Application from "../../application.js";
import type {
	InteractionKitCommand,
	RequestBody,
	ResponseHandler,
} from "../../interfaces.js";
import ApplicationCommandInteraction from "./application-command-interaction.js";

export default class SlashCommandInteraction extends ApplicationCommandInteraction {
	readonly #options: Map<
		string,
		APIApplicationCommandInteractionDataBasicOption
	>;

	constructor(
		application: Application,
		command: InteractionKitCommand<SlashCommandInteraction>,
		json: RequestBody<APIChatInputApplicationCommandInteraction>,
		respond: ResponseHandler
	) {
		super(application, json, respond);
		this.#options = new Map();

		json.data?.options?.forEach((option) => {
			if (
				option.type !== ApplicationCommandOptionType.Subcommand &&
				option.type !== ApplicationCommandOptionType.SubcommandGroup
			) {
				this.#options.set(option.name, option);
			}
		});
	}

	get commandType() {
		return ApplicationCommandType.ChatInput;
	}

	// TODO: Type? Should return an object where keys = #options keys, and value = ApplicationCommandInteractionDataOption
	get options() {
		return new Proxy(
			{},
			{
				get: (
					target,
					property
				): APIApplicationCommandInteractionDataBasicOption["value"] | null =>
					this.#options.get(property.toString())?.value ?? null,
			}
		);
	}
}
