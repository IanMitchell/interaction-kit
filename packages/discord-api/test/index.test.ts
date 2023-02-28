import { expect, test } from "vitest";
import * as API from "../src/index";

test("API is backwards compatible", () => {
	expect(Object.keys(API)).toMatchInlineSnapshot(`
		[
		  "DiscordApiClient",
		  "client",
		  "getGlobalApplicationCommands",
		  "createGlobalApplicationCommand",
		  "getGlobalApplicationCommand",
		  "editGlobalApplicationCommand",
		  "deleteGlobalApplicationCommand",
		  "bulkOverwriteGlobalApplicationCommands",
		  "getGuildApplicationCommands",
		  "createGuildApplicationCommand",
		  "getGuildApplicationCommand",
		  "editGuildApplicationCommands",
		  "deleteGuildApplicationCommand",
		  "bulkOverwriteGuildApplicationCommands",
		  "getGuild",
		  "createInteractionFollowup",
		  "editInteractionFollowup",
		  "deleteInteractionFollowup",
		]
	`);
});
