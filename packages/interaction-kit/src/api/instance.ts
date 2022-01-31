import pkg from "../../package.json";
import { REST } from "@discordjs/rest";

const instance = new REST({
	handlerSweepInterval: 0,
	hashSweepInterval: 0,
	userAgentAppendix: `InteractionKit, ${pkg.version}`,
	version: "9",
});

export default instance;
