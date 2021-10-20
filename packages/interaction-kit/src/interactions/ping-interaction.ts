import type { FastifyReply, FastifyRequest } from "fastify";
import Application from "../application";
import {
	Interaction as InteractionDefinition,
	InteractionCallbackType,
	InteractionRequestType,
} from "../definitions";

export default class PingInteraction {
	public readonly type = InteractionRequestType.PING;
	public readonly response: FastifyReply;

	constructor(
		application: Application,
		request: FastifyRequest<{ Body: InteractionDefinition }>,
		response: FastifyReply
	) {
		this.response = response;
	}

	handler() {
		void this.response.send({
			type: InteractionCallbackType.PONG,
		});
	}
}
