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

test("getRouteInformation should identify interaction tokens as the primary id", () => {
	expect(
		getRouteInformation(
			"/webhooks/815369174096412695/aW50ZXJhY3Rpb246MTA2OTg3MjU4MDM1OTYzMDg2ODpMN0RWMFp6NGxzbVltTTRUY01yMHhWMzhaY1E4ZjUwSWVxZVlja0JpajdMbDEzS0dZN3dFR1lwTVVkTGdUY0lBek12SjY2OUxPQnFPbWlpSVJNMkJOWW5OZlZ6S2Y2dm16bVhHOW95WDBDWUdUaXI3dVVzMWtzWXJOaEJscXRrTg"
		)
	).toEqual({
		path: "/webhooks/:id/:token",
		identifier:
			"aW50ZXJhY3Rpb246MTA2OTg3MjU4MDM1OTYzMDg2ODpMN0RWMFp6NGxzbVltTTRUY01yMHhWMzhaY1E4ZjUwSWVxZVlja0JpajdMbDEzS0dZN3dFR1lwTVVkTGdUY0lBek12SjY2OUxPQnFPbWlpSVJNMkJOWW5OZlZ6S2Y2dm16bVhHOW95WDBDWUdUaXI3dVVzMWtzWXJOaEJscXRrTg",
	});

	expect(
		getRouteInformation(
			"/interactions/815369174196412695/aW50ZXJhY3Rpb246MTA2OTg3MjYwMjA5MDMxMTY5MDo3MzN1VDdMZWM0dVRBbTRwdks0UGpKY0FIWk1TdUJ2Vk5OUzhKN0dZSlV5aGFjSzNZajVOQmVSWEt3SnBENkZKWmo3QzBGQzJpTnZKUkNTYTR5NGtGNTQ3M2NhbzZPY2NyRnNhQXFFUG5LMXEzZTJ3VHZnamVLYVJsUlptU3F2eQ/callback"
		)
	).toEqual({
		path: "/interactions/:id/:token/callback",
		identifier:
			"aW50ZXJhY3Rpb246MTA2OTg3MjYwMjA5MDMxMTY5MDo3MzN1VDdMZWM0dVRBbTRwdks0UGpKY0FIWk1TdUJ2Vk5OUzhKN0dZSlV5aGFjSzNZajVOQmVSWEt3SnBENkZKWmo3QzBGQzJpTnZKUkNTYTR5NGtGNTQ3M2NhbzZPY2NyRnNhQXFFUG5LMXEzZTJ3VHZnamVLYVJsUlptU3F2eQ",
	});
});
