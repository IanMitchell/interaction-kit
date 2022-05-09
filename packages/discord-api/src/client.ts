import pkg from "../package.json" assert { type: "json" };
import Client from "discord-request";

class DiscordApiClient extends Client {
	setUserAgent(value: string) {
		return super.setUserAgent(`${value}, discord-api ${pkg.version}`);
	}
}

const instance = new DiscordApiClient({
	bucketSweepInterval: 0,
	queueSweepInterval: 0,
	userAgent: `discord-api ${pkg.version}`,
});

export default instance;
