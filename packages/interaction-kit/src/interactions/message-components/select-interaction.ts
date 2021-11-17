import MessageComponentInteraction from "./message-component-interaction";
import type { FastifyReply, FastifyRequest } from "fastify";
import {
	Interaction as InteractionDefinition,
	SelectOption,
} from "../../definitions";
import Application from "../../application";
import Select from "../../components/select";

export default class SelectInteraction extends MessageComponentInteraction {
	public readonly values: Set<SelectOption>;

	constructor(
		application: Application,
		component: Select,
		request: FastifyRequest<{ Body: InteractionDefinition }>,
		response: FastifyReply
	) {
		super(application, request, response);

		const options: SelectOption[] =
			request?.body?.data?.values
				?.map((value: SelectOption["value"]) => component.options._choices.get(value))
				?.filter((value: SelectOption): value is SelectOption => value != null) ?? [];

		this.values = new Set<SelectOption>(options);
	}
}
