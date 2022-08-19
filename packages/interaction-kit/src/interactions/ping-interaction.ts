import type { APIPingInteraction } from "discord-api-types/v10";
import {
	InteractionResponseType,
	InteractionType,
} from "discord-api-types/v10";
import type Application from "../application.js";
import type { RequestBody, ResponseHandler } from "../interfaces.js";
import { ResponseStatus } from "../requests/response.js";

export default class PingInteraction {
	public readonly type = InteractionType.Ping;
	readonly #respond: ResponseHandler;

	constructor(
		application: Application,
		json: RequestBody<APIPingInteraction>,
		respond: ResponseHandler
	) {
		this.#respond = respond;
	}

	handler() {
		this.#respond(ResponseStatus.OK, {
			type: InteractionResponseType.Pong,
		});
	}
}
