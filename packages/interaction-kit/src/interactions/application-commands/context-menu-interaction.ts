import {
	APIContextMenuInteraction,
	ApplicationCommandType,
} from "discord-api-types/v10";
import Application from "../../application";
import {
	InteractionKitCommand,
	RequestBody,
	ResponseHandler,
} from "../../interfaces";
import ApplicationCommandInteraction from "./application-command-interaction";

export type ContextMenuApplicationCommandType = Exclude<
	ApplicationCommandType,
	ApplicationCommandType.ChatInput
>;

type MessageTargetType = {
	pinned: boolean;
};

type UserTargetType = {
	bot: boolean;
};

type TargetType<T extends ContextMenuApplicationCommandType> =
	T extends ApplicationCommandType.Message
		? MessageTargetType
		: T extends ApplicationCommandType.User
		? UserTargetType
		: unknown;

export default class ContextMenuInteraction<
	T extends ContextMenuApplicationCommandType
> extends ApplicationCommandInteraction {
	public readonly commandType: T;
	public readonly target: TargetType<T>;

	constructor(
		application: Application,
		command: InteractionKitCommand<ContextMenuInteraction<T>>,
		json: RequestBody<APIContextMenuInteraction>,
		respond: ResponseHandler
	) {
		super(application, json, respond);

		const id = json.data.target_id;

		// TODO: Clean this up
		switch (json.data?.type) {
			case ApplicationCommandType.Message:
				// @ts-expect-error This is set at runtime but it's guaranteed to be the generic
				this.commandType = ApplicationCommandType.Message;
				// @ts-expect-error Same as above
				this.target = (json.data?.resolved?.messages?.[id] ??
					{}) as MessageTargetType;
				break;
			case ApplicationCommandType.User:
				// @ts-expect-error This is set at runtime but it's guaranteed to be the generic
				this.commandType = ApplicationCommandType.User;
				// @ts-expect-error Same as above
				this.target = {
					...(json.data?.resolved?.members?.[id] ?? {}),
					...(json.data?.resolved?.users?.[id] ?? {}),
				};
				break;
			default:
				// TODO: Improve the error
				throw new Error("Unknown Context Menu Type");
		}
	}
}
