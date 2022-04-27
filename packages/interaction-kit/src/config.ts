import type { Snowflake } from "discord-snowflake";

export default (() => {
	let APPLICATION_ID: Snowflake = `${BigInt(0)}`;

	return {
		getApplicationId: () => APPLICATION_ID,
		setApplicationId: (id: Snowflake) => {
			APPLICATION_ID = id;
		},
	};
})();
