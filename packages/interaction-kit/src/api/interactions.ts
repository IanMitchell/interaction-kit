import Config from "./config";
import rest from "./instance";
import {
	RESTPostAPIInteractionFollowupJSONBody,
	RESTPatchAPIInteractionFollowupJSONBody,
	RESTDeleteAPIInteractionFollowupResult,
	RESTPatchAPIInteractionFollowupResult,
	Routes,
} from "discord-api-types/v9";

// TODO: Test, Type, Document
export async function postInteractionFollowup(
	interactionToken: string,
	data: RESTPostAPIInteractionFollowupJSONBody,
	applicationID = Config.getApplicationID()
) {
	return rest.post(Routes.webhook(applicationID, interactionToken), {
		body: data,
	}) as Promise<RESTPostAPIInteractionFollowupJSONBody>;
}

// TODO: Test, Type, Document
export async function patchInteractionFollowup(
	interactionToken: string,
	id: string,
	data: RESTPatchAPIInteractionFollowupJSONBody,
	applicationID = Config.getApplicationID()
) {
	return rest.patch(
		Routes.webhookMessage(applicationID, interactionToken, id),
		{
			body: data,
		}
	) as Promise<RESTPatchAPIInteractionFollowupResult>;
}

// TODO: Test, Type, Document
export async function deleteInteractionFollowup(
	interactionToken: string,
	id: string,
	applicationID = Config.getApplicationID()
) {
	return rest.delete(
		Routes.webhookMessage(applicationID, interactionToken, id)
	) as Promise<RESTDeleteAPIInteractionFollowupResult>;
}
