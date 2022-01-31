import type { FastifyReply, FastifyRequest } from "fastify";
import { InputKey } from "../..";
import Application from "../../application";
import {
	ApplicationCommandType,
	Interaction as InteractionDefinition,
} from "../../definitions";
import { InteractionKitCommand } from "../../interfaces";
import ApplicationCommandInteraction from "./application-command-interaction";

type InteractionOptions<T extends readonly [InputKey, ...InputKey[]] | []> = {
	[Key in T[number]["name"]]: Extract<T[number], { name: Key }> extends {
		optional: true;
	}
		? Extract<T[number], { name: Key }> | undefined
		: Extract<T[number], { name: Key }>;
};

// type SlashCommandInteractionBody<
// 	T extends readonly [InputKey, ...InputKey[]] | []
// > = Omit<InteractionDefinition, "data"> & {
// 	data: Omit<InteractionDefinition["data"], "options"> & {
// 		options: InteractionOptions<T>;
// 	};
// };

interface SlashCommandInteractionBody<
	T extends readonly [InputKey, ...InputKey[]] | []
> extends InteractionDefinition {
	data: Omit<InteractionDefinition["data"], "options"> & {
		options: InteractionOptions<T>;
	};
}

export default class SlashCommandInteraction<
	T extends readonly [InputKey, ...InputKey[]] | []
> extends ApplicationCommandInteraction {
	public readonly options: InteractionOptions<T>;

	constructor(
		application: Application,
		command: InteractionKitCommand<SlashCommandInteraction<T>>,
		request: FastifyRequest<{ Body: SlashCommandInteractionBody<T> }>,
		response: FastifyReply
	) {
		super(application, request, response);
		this.options = request.body?.data?.options;
	}

	get commandType() {
		return ApplicationCommandType.CHAT_INPUT;
	}
}
