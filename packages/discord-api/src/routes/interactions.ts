import type { Snowflake } from "discord-snowflake";
import client from "../client";
import {
	RESTPostAPIInteractionFollowupJSONBody,
	RESTPatchAPIInteractionFollowupJSONBody,
	RESTDeleteAPIInteractionFollowupResult,
	RESTPatchAPIInteractionFollowupResult,
	Routes,
	RESTPostAPIInteractionFollowupResult,
} from "discord-api-types/v10";

// TODO: Test, Type, Document
export async function postInteractionFollowup(
	applicationId: Snowflake,
	interactionToken: string,
	data: RESTPostAPIInteractionFollowupJSONBody
) {
	return client.post(Routes.webhook(applicationId, interactionToken), {
		body: data,
	}) as Promise<RESTPostAPIInteractionFollowupResult>;
}

// TODO: Test, Type, Document
export async function patchInteractionFollowup(
	applicationId: Snowflake,
	interactionToken: string,
	id: string,
	data: RESTPatchAPIInteractionFollowupJSONBody
) {
	return client.patch(
		Routes.webhookMessage(applicationId, interactionToken, id),
		{
			body: data,
		}
	) as Promise<RESTPatchAPIInteractionFollowupResult>;
}

// TODO: Test, Type, Document
export async function deleteInteractionFollowup(
	applicationId: Snowflake,
	interactionToken: string,
	id: string
) {
	return client.delete(
		Routes.webhookMessage(applicationId, interactionToken, id)
	) as Promise<RESTDeleteAPIInteractionFollowupResult>;
}
