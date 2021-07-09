import { InteractionRequestType } from "../definitions";

export default class PingInteraction {
	public readonly type = InteractionRequestType.PING;
}
