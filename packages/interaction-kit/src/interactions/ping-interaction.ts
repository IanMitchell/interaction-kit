import { InteractionRequestType } from "../definitions";
import { Interaction } from "../interfaces";

export default class PingInteraction implements Interaction {
	public readonly type = InteractionRequestType.PING;
}
