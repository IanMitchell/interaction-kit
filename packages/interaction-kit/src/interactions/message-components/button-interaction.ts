import MessageComponentInteraction from "./message-component-interaction";
import Application from "../../application";
import { Button } from "../../components/button";
import { RequestBody, ResponseHandler } from "../../interfaces";
import { APIMessageButtonInteractionData } from "discord-api-types/payloads/v9";

export default class ButtonInteraction extends MessageComponentInteraction {
	constructor(
		application: Application,
		component: Button,
		json: RequestBody<APIMessageButtonInteractionData>,
		respond: ResponseHandler
	) {
		super(application, json, respond);
	}
}
