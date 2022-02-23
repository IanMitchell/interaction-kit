import type { FastifyReply, FastifyRequest } from "fastify";
import Application from "../../application";
import { InputKey } from "../../components/inputs";
import {
	Interaction as InteractionDefinition,
	Snowflake,
} from "../../definitions";
import { Autocomplete } from "../../interfaces";
import { AutocompleteInteractionTypes, AutocompleteTypes } from "./types";

export default class AutocompleteInteraction<
	U extends readonly [InputKey, ...InputKey[]] | [],
	T extends AutocompleteTypes<U>
> implements Autocomplete<T>
{
	public readonly name: string;
	public readonly token: string;

	public readonly response: FastifyReply;

	// TODO: Convert these into Records
	public readonly channelID: Snowflake | undefined;
	public readonly guildID: Snowflake | undefined;
	public readonly member: Record<string, unknown> | undefined;

	// readonly #options: Map<string, ApplicationCommandInteractionDataOption>;
	readonly #application: Application;
	readonly #type: AutocompleteInteractionTypes;

	constructor(
		application: Application,
		request: FastifyRequest<{ Body: InteractionDefinition }>,
		response: FastifyReply,
		type: AutocompleteInteractionTypes
	) {
		this.#type = type;
		this.#application = application;
		this.response = response;
		this.token = request.body.token;
		this.name = request.body.data?.name?.toLowerCase() ?? "";

		// TEMPORARY
		this.member = request.body?.member;

		request.body?.data?.options?.forEach((option) => {
			this.#options.set(option.name.toLowerCase(), option);
		});
	}

	reply(options: T[]) {
		return this.response.status(200).send({
			type: this.#type,
			data: {
				choices: options.map((option) => option.serialize()),
			},
		});
	}
}
