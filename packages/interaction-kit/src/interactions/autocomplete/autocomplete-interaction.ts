import type {
	APIApplicationCommandAutocompleteInteraction,
	APIApplicationCommandAutocompleteResponse,
	APIApplicationCommandInteractionDataOption,
	APIApplicationCommandOptionChoice,
	APIInteractionGuildMember,
} from "discord-api-types/v10";
import type { Snowflake } from "discord-snowflake";
import type Application from "../../application.js";
import type { Choices } from "../../commands/options/choices.js";
import type { APIApplicationCommandInteractionDataAutocompleteOption } from "../../commands/options/option.js";
import { isAutocompleteOption } from "../../commands/options/option.js";
import type {
	Autocomplete,
	RequestBody,
	ResponseHandler,
} from "../../interfaces.js";
import { ResponseStatus } from "../../requests/response.js";
import type { AutocompleteInteractionResponseTypes } from "./types.js";

// TODO: Specify string or number?
export default class AutocompleteInteraction<
	T extends APIApplicationCommandOptionChoice
> implements Autocomplete<T>
{
	public readonly name: string;
	public readonly token: string;
	// TODO: Should this be called "focused"?
	public readonly target: APIApplicationCommandInteractionDataAutocompleteOption;

	public readonly options: Map<
		string,
		APIApplicationCommandInteractionDataOption
	> = new Map();

	// TODO: Convert these into Records
	public readonly channelId: Snowflake | undefined;
	public readonly guildId: Snowflake | undefined;
	public readonly member: APIInteractionGuildMember | undefined;

	readonly #application: Application;
	readonly #type: AutocompleteInteractionResponseTypes;
	readonly #respond: ResponseHandler<APIApplicationCommandAutocompleteResponse>;

	constructor(
		application: Application,
		// This will need to be changed to a more generic version someday, but for now
		// is the only type
		json: RequestBody<APIApplicationCommandAutocompleteInteraction>,
		respond: ResponseHandler,
		type: AutocompleteInteractionResponseTypes
	) {
		this.#type = type;
		this.#application = application;
		this.#respond = respond;
		this.token = json.token;
		this.name = json.data.name;

		const target = json.data?.options?.find(
			(option) => isAutocompleteOption(option) && option.focused
		) as APIApplicationCommandInteractionDataAutocompleteOption;

		if (target == null) {
			throw new Error("No target option was specified");
		}

		this.target = target;

		json.data?.options?.forEach((option) => {
			this.options.set(option.name.toLowerCase(), option);
		});

		// TEMPORARY
		this.member = json.member;
	}

	async reply(options: Choices<T>) {
		return this.#respond(ResponseStatus.OK, {
			type: this.#type,
			data: {
				choices: options.serialize(),
			},
		});
	}
}
