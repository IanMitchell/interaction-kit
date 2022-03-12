import {
	InteractionType,
	InteractionResponseType,
	APIPingInteraction,
} from "discord-api-types/v9";
import Application from "../application";
import { RequestBody, ResponseHandler } from "../interfaces";
import { ResponseStatus } from "../requests/response";

export default class PingInteraction {
	public readonly type = InteractionType.Ping;
	public readonly respond: ResponseHandler;

	constructor(
		application: Application,
		json: RequestBody<APIPingInteraction>,
		respond: ResponseHandler
	) {
		this.respond = respond;
	}

	handler() {
		void this.respond(ResponseStatus.OK, {
			type: InteractionResponseType.Pong,
		});
	}
}
