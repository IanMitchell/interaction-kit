import type { Snowflake } from "discord-snowflake";
import { client } from "../client.js";

// TODO: Test, Document
export async function updateApplication(
	applicationId: Snowflake,
	interactionsURL: string
) {
	return client.patch(`/applications/${applicationId}`, {
		body: {
			interactions_endpoint_url: interactionsURL,
		},
	});
}
