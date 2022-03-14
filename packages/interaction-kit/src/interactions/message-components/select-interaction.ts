import MessageComponentInteraction from "./message-component-interaction";
import Application from "../../application";
import Select from "../../components/select";
import type {
	APIMessageComponentSelectMenuInteraction,
	APISelectMenuOption,
} from "discord-api-types/v9";
import { RequestBody, ResponseHandler } from "../../interfaces";

export default class SelectInteraction extends MessageComponentInteraction {
	public readonly values: Set<APISelectMenuOption>;

	constructor(
		application: Application,
		component: Select,
		json: RequestBody<APIMessageComponentSelectMenuInteraction>,
		respond: ResponseHandler
	) {
		super(application, json, respond);

		const options: APISelectMenuOption[] =
			json.data?.values
				?.map((value) => component.options._choices.get(value))
				?.filter((value): value is APISelectMenuOption => value != null) ?? [];

		this.values = new Set<APISelectMenuOption>(options);
	}
}
