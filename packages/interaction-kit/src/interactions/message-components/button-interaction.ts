import MessageComponentInteraction from "./message-component-interaction";
import Application from "../../application";
import { Button } from "../../components/button";
import { RequestBody, ResponseHandler } from "../../interfaces";
import { APIMessageComponentButtonInteraction } from "discord-api-types/payloads/v9";

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
