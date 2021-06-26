import pkg from "../../package.json";

// TODO: Move into a new spot for circular deps
export function getStandardHeaders(json = true) {
	return {
		"user-agent": `InteractionKit (https://interactionkit.dev, ${pkg.version})`,
		"Content-Type": json ? "application/json" : "x-www-form-urlencoded",
	};
}

export * from "./commands";
export * from "./guild";
export * from "./interactions";
