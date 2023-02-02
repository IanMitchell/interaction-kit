import type { RequestMethod, Route } from "../types.js";

export function getRouteKey(method: RequestMethod | undefined, route: Route) {
	return `${method ?? "get"}:${route.path}`;
}

export function getRouteInformation(route: string): Route {
	const match =
		/^\/(?:channels|guilds|webhooks|interactions)\/(?<snowflake>\d{16,19})(?:\/(?<token>aW50ZXJhY3Rpb24\w+))?/.exec(
			route
		);
	const identifier =
		match?.groups?.token ?? match?.groups?.snowflake ?? "global";
	const path = route
		// Replace Snowflake IDs
		.replace(/\d{16,19}/g, ":id")
		// Replace Interaction Tokens
		.replace(/aW50ZXJhY3Rpb24\w+/g, ":token")
		// Reactions share a bucket
		.replace(/\/reactions\/(.*)/, "/reactions/:reaction");

	return {
		// FIXME: This is not a path, but a route identifier
		path,
		// FIXME: This is a route major identifier
		identifier,
	};
}
