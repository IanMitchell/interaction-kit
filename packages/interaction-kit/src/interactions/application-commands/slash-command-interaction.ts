import {
	APIApplicationCommandInteractionDataOption,
	APIChatInputApplicationCommandInteraction,
	ApplicationCommandType,
} from "discord-api-types/payloads/v9";
import Application from "../../application";
import {
	InteractionKitCommand,
	RequestBody,
	ResponseHandler,
} from "../../interfaces";
import ApplicationCommandInteraction from "./application-command-interaction";

export default class SlashCommandInteraction extends ApplicationCommandInteraction {
	readonly #options: Map<string, APIApplicationCommandInteractionDataOption>;

	constructor(
		application: Application,
		command: InteractionKitCommand<SlashCommandInteraction>,
		json: RequestBody<APIChatInputApplicationCommandInteraction>,
		respond: ResponseHandler
	) {
		super(application, json, respond);
		this.#options = new Map();

		json.data?.options?.forEach((option) => {
			this.#options.set(option.name.toLowerCase(), option);
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
				): APIApplicationCommandInteractionDataOption["value"] | null =>
					this.#options.get(property.toString())?.value ?? null,
			}
		);
	}
}
