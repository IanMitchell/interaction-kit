import type { APIMessageComponentButtonInteraction } from "discord-api-types/v10";
import type Application from "../../application.js";
import type { Button } from "../../components/button.js";
import type { RequestBody, ResponseHandler } from "../../interfaces.js";
import MessageComponentInteraction from "./message-component-interaction.js";

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
