import type { RESTPatchAPIChannelJSONBody } from "discord-api-types/v10";
import { RequestMethod, Route } from "../types";

export function getRouteInformation(route: string): Route {
	const match = /^\/(?:channels|guilds|webhooks)\/(?<snowflake>\d{16,19})/.exec(
		route
	);
	const identifier = match?.groups?.snowflake ?? "global";
	const path = route
		// Replace Snowflake IDs
		.replace(/\d{16,19}/g, ":id")
		// Reactions share a bucket
		.replace(/\/reactions\/(.*)/, "/reactions/:reaction");

	return {
		path,
		identifier,
	};
}

export function isSublimitedRoute(
	bucketRoute: string,
	body?: RequestInit["body"],
	method?: string
): boolean {
	// Editing channel `name` or `topic` has severe rate limits
	if (bucketRoute === "/channels/:id") {
		if (
			typeof body !== "object" ||
			body === null ||
			method !== RequestMethod.Patch
		) {
			return false;
		}

		return (
			"name" in (body as RESTPatchAPIChannelJSONBody) ||
			"topic" in (body as RESTPatchAPIChannelJSONBody)
		);
	}

	// If we've already been sublimited and don't know why, treat all requests as submlimits
	return true;
}
