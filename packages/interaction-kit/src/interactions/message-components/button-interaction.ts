import type { APIMessageComponentButtonInteraction } from "discord-api-types/v10";
import type Application from "../../application";
import type { Button } from "../../components/button";
import type { RequestBody, ResponseHandler } from "../../interfaces";
import MessageComponentInteraction from "./message-component-interaction";

export default class ButtonInteraction extends MessageComponentInteraction {
	constructor(
		application: Application,
		component: Button,
		json: RequestBody<APIMessageComponentButtonInteraction>,
		respond: ResponseHandler
	) {
		super(application, json, respond);
	}
}
