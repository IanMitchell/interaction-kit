import type { FastifyReply, FastifyRequest } from "fastify";
import {
	Interaction as InteractionDefinition,
	InteractionRequestType,
} from "../definitions";
import Application from "../application";
import { Interaction } from "../interfaces";

export default class MessageComponentInteraction implements Interaction {
	public readonly type = InteractionRequestType.MESSAGE_COMPONENT;
	public readonly token: string;
	public readonly response: FastifyReply;
	public readonly customID: string;
	readonly #application: Application;

	constructor(
		application: Application,
		request: FastifyRequest<{ Body: InteractionDefinition }>,
		response: FastifyReply
	) {
		this.#application = application;
		this.response = response;
		this.token = request.body.token;
		this.customID = request?.body?.data?.custom_id ?? "";
	}
}
