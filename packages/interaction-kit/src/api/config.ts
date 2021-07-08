import pkg from "../../package.json";
import { Snowflake } from "../definitions";

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

		getHeaders: (json = true) => {
			return {
				"user-agent": `InteractionKit (https://interactionkit.dev, ${pkg.version})`,
				"Content-Type": json ? "application/json" : "x-www-form-urlencoded",
				"Authorization": `Bot ${TOKEN}`,
			};
		},
	};
})();
