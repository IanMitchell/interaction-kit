import type { Snowflake } from "../structures/snowflake";
import rest from "./instance";

export default (() => {
	let APPLICATION_ID: Snowflake = `${BigInt(0)}`;

	return {
		getApplicationId: () => APPLICATION_ID,

		setToken: (token: string) => {
			rest.setToken(token);
		},

		setApplicationId: (id: Snowflake) => {
			APPLICATION_ID = id;
		},
	};
})();
