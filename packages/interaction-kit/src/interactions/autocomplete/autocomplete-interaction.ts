import Application from "../../application";
import { Autocomplete, RequestBody, ResponseHandler } from "../../interfaces";
import { AutocompleteInteractionTypes, AutocompleteTypes } from "./types";
import {
	APIApplicationCommandAutocompleteInteraction,
	APIApplicationCommandAutocompleteResponse,
	APIInteractionGuildMember,
} from "discord-api-types/v9";
import { ResponseStatus } from "../../requests/response";
import type { Snowflake } from "../../structures/snowflake";

export default class AutocompleteInteraction<T extends AutocompleteTypes>
	implements Autocomplete<T>
{
	public readonly name: string;
	public readonly token: string;

	public readonly respond: ResponseHandler<APIApplicationCommandAutocompleteResponse>;

	// TODO: Convert these into Records
	public readonly channelID: Snowflake | undefined;
	public readonly guildID: Snowflake | undefined;
	public readonly member: APIInteractionGuildMember | undefined;

	// readonly #options: Map<string, ApplicationCommandInteractionDataOption>;
	readonly #application: Application;
	readonly #type: AutocompleteInteractionTypes;

	constructor(
		application: Application,
		// This will need to be changed to a more generic version someday, but for now
		// is the only type
		json: RequestBody<APIApplicationCommandAutocompleteInteraction>,
		respond: ResponseHandler,
		type: AutocompleteInteractionTypes
	) {
		this.#type = type;
		this.#application = application;
		this.respond = respond;
		this.token = json.token;
		this.name = json.data.name;

		// TEMPORARY
		this.member = json.member;

		// TODO: Add target

		json.data?.options?.forEach((option) => {
			this.#options.set(option.name.toLowerCase(), option);
		});
	}

	async reply(options: T[]) {
		return this.respond(ResponseStatus.OK, {
			type: this.#type,
			data: {
				choices: options.map((option) => option.serialize()),
			},
		});
	}
}
