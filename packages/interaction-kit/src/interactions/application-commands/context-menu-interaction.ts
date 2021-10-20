import type { FastifyReply, FastifyRequest } from "fastify";
import {
	Interaction as InteractionDefinition,
	ApplicationCommandType,
} from "../../definitions";
import Application from "../../application";
import ApplicationCommandInteraction from "./application-command-interaction";

export type ContextMenuApplicationCommandType = Exclude<
	ApplicationCommandType,
	ApplicationCommandType.CHAT_INPUT
>;

type MessageTargetType = {
	pinned: boolean;
};

type UserTargetType = {
	bot: boolean;
};

type TargetType<T extends ContextMenuApplicationCommandType> =
	T extends ApplicationCommandType.MESSAGE
		? MessageTargetType
		: T extends ApplicationCommandType.USER
		? UserTargetType
		: unknown;

export default class ContextMenuInteraction<
	T extends ContextMenuApplicationCommandType
> extends ApplicationCommandInteraction {
	public readonly commandType: T;
	public readonly target: TargetType<T>;

	constructor(
		application: Application,
		command: unknown, // TODO: Fix
		request: FastifyRequest<{ Body: InteractionDefinition }>,
		response: FastifyReply
	) {
		super(application, request, response);

		const id = request.body.data?.target_id ?? "0";
		switch (request.body.data?.type) {
			case ApplicationCommandType.MESSAGE:
				// @ts-expect-error This is set at runtime but it's guaranteed to be the generic
				this.commandType = ApplicationCommandType.MESSAGE;
				// @ts-expect-error Same as above
				this.target = (request.body.data?.resolved?.messages?.[id] ??
					{}) as MessageTargetType;
				break;
			case ApplicationCommandType.USER:
				// @ts-expect-error This is set at runtime but it's guaranteed to be the generic
				this.commandType = ApplicationCommandType.USER;
				// @ts-expect-error Same as above
				this.target = {
					...(request.body?.data?.resolved?.members?.[id] ?? {}),
					...(request.body?.data?.resolved?.users?.[id] ?? {}),
				};
				break;
			default:
				// TODO: Improve the error
				throw new Error("Unknown Context Menu Type");
		}
	}
}
