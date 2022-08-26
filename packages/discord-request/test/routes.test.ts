import { expect, test } from "vitest";
import { getRouteInformation } from "../src/util/routes.js";

test("getRouteInformation should extract snowflakes", () => {
	expect(
		getRouteInformation(
			"/guilds/815369174096412692/channels/905838550522671144"
		)
	).toEqual({
		path: "/guilds/:id/channels/:id",
		identifier: "815369174096412692",
	});
});

test("getRouteInformation should replace snowflakes with `:id`", () => {
	expect(getRouteInformation("/channels/815369174096412695")).toEqual({
		path: "/channels/:id",
		identifier: "815369174096412695",
	});
});
