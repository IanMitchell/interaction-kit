import type {
	RESTDeleteAPIInteractionFollowupResult,
	RESTPatchAPIInteractionFollowupJSONBody,
	RESTPatchAPIInteractionFollowupResult,
	RESTPostAPIInteractionFollowupJSONBody,
	RESTPostAPIInteractionFollowupResult,
} from "discord-api-types/v10";
import { Routes } from "discord-api-types/v10";
import type { Snowflake } from "discord-snowflake";
import { client } from "../client.js";

// TODO: Test, Document
export async function createInteractionFollowup(
	applicationId: Snowflake,
	interactionToken: string,
	data: RESTPostAPIInteractionFollowupJSONBody
) {
	return client.post(Routes.webhook(applicationId, interactionToken), {
		body: data,
		ignoreGlobalLimit: true,
	}) as Promise<RESTPostAPIInteractionFollowupResult>;
}

// export async function getInteractionFollowup(
// 	applicationId: Snowflake,
// 	interactionToken: string,
// 	messageId: Snowflake
// ) {
// 	return client.get(
// 		Routes.webhook(applicationId, interactionToken, messageId)
// 	) as Promise<RESTGetAPIInteractionFollowupResult>;
// }

// TODO: Test, Document
export async function editInteractionFollowup(
	applicationId: Snowflake,
	interactionToken: string,
	id: string,
	data: RESTPatchAPIInteractionFollowupJSONBody
) {
	return client.patch(
		Routes.webhookMessage(applicationId, interactionToken, id),
		{
			body: data,
			ignoreGlobalLimit: true,
		}
	) as Promise<RESTPatchAPIInteractionFollowupResult>;
}

// TODO: Test, Document
export async function deleteInteractionFollowup(
	applicationId: Snowflake,
	interactionToken: string,
	id: string
) {
	return client.delete(
		Routes.webhookMessage(applicationId, interactionToken, id),
		{ ignoreGlobalLimit: true }
	) as Promise<RESTDeleteAPIInteractionFollowupResult>;
}
