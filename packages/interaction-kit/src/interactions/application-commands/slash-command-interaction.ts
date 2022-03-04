import {
	APIApplicationCommandInteractionDataBasicOption,
	APIChatInputApplicationCommandInteraction,
	ApplicationCommandOptionType,
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
	// TODO: lol u know subcommands and subgroups are a thing right mr discord developer
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
				this.#options.set(option.name.toLowerCase(), option);
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
