import { Snowflake } from "../definitions";
import rest from "./instance";

export default (() => {
	let APPLICATION_ID: Snowflake = `${BigInt(0)}`;

	return {
		getApplicationID: () => APPLICATION_ID,

		setToken: (token: string) => {
			rest.setToken(token);
		},

		setApplicationID: (id: Snowflake) => {
			APPLICATION_ID = id;
		},
	};
})();
