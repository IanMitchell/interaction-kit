import pkg from "../../package.json";

// TODO: Move into a new spot for circular deps
export function getStandardHeaders(json = true) {
	return {
		"user-agent": `InteractionKit (https://interactionkit.dev, ${pkg.version})`,
		"Content-Type": json ? "application/json" : "x-www-form-urlencoded",
	};
}

// TODO: Create a closure that automatically passes in standard headers and app ids, tokens, etc
// in order to simplify the API

export * from "./commands";
export * from "./guild";
export * from "./interactions";
