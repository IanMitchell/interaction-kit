import pkg from "../../package.json" assert { type: "json" };
import Client from "discord-request";

const instance = new Client({
	version: "9",
	userAgent: `InteractionKit, ${pkg.version}`,
	bucketSweepInterval: 0,
	queueSweepInterval: 0,
});

export default instance;
