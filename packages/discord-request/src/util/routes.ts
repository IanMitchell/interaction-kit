import { RequestMethod, Route } from "../types";

export function getRouteKey(method: RequestMethod | undefined, route: Route) {
	return `${method ?? "get"}:${route.path}`;
}

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
