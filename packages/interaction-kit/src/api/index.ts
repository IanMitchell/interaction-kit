import pkg from "../../../../package.json";

export function getStandardHeaders(json = true) {
	return {
		"user-agent": `InteractionKit (https://interactionkit.dev, ${pkg.version})`,
		"Content-Type": json ? "application/json" : "x-www-form-urlencoded",
	};
}

export * from "./interactions";
export * from "./guild";
