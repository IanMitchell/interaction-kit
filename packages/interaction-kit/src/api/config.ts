import { Snowflake } from "../definitions";
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
const pkg = require("../../package.json") as Record<string, unknown>;

export default (() => {
	let TOKEN = "";
	let APPLICATION_ID: Snowflake = `${BigInt(0)}`;

	return {
		getApplicationID: () => APPLICATION_ID,

		setToken: (token: string) => {
			TOKEN = token;
		},

		setApplicationID: (id: Snowflake) => {
			APPLICATION_ID = id;
		},

		getHeaders: (json = true) => ({
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			"user-agent": `InteractionKit (https://interactionkit.dev, ${pkg.version})`,
			"Content-Type": json ? "application/json" : "x-www-form-urlencoded",
			"Authorization": `Bot ${TOKEN}`,
		}),
	};
})();
