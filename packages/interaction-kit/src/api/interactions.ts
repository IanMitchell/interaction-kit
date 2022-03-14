import Config from "./config";
import rest from "./instance";
import {
	RESTPostAPIInteractionFollowupJSONBody,
	RESTPatchAPIInteractionFollowupJSONBody,
	RESTDeleteAPIInteractionFollowupResult,
	RESTPatchAPIInteractionFollowupResult,
	Routes,
	RESTPostAPIInteractionFollowupResult,
} from "discord-api-types/v9";

// TODO: Test, Type, Document
export async function postInteractionFollowup(
	interactionToken: string,
	data: RESTPostAPIInteractionFollowupJSONBody,
	applicationId = Config.getApplicationId()
) {
	return rest.post(Routes.webhook(applicationId, interactionToken), {
		body: data,
	}) as Promise<RESTPostAPIInteractionFollowupResult>;
}

// TODO: Test, Type, Document
export async function patchInteractionFollowup(
	interactionToken: string,
	id: string,
	data: RESTPatchAPIInteractionFollowupJSONBody,
	applicationId = Config.getApplicationId()
) {
	return rest.patch(
		Routes.webhookMessage(applicationId, interactionToken, id),
		{
			body: data,
		}
	) as Promise<RESTPatchAPIInteractionFollowupResult>;
}

// TODO: Test, Type, Document
export async function deleteInteractionFollowup(
	interactionToken: string,
	id: string,
	applicationId = Config.getApplicationId()
) {
	return rest.delete(
		Routes.webhookMessage(applicationId, interactionToken, id)
	) as Promise<RESTDeleteAPIInteractionFollowupResult>;
}
