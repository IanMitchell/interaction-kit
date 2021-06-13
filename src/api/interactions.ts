import APIClient from "src/requests/client";

export function postWebhookMessage({ applicationID, interactionToken, data }) {
	return APIClient.post("/", {});
}

export function deleteWebhookMessage();

export function patchWebhookMessage();
