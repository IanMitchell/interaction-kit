import type { Snowflake } from "discord-snowflake";

export default (() => {
	let APPLICATION_ID: Snowflake = `${BigInt(0)}`;
	let AUTO_DEFER_APPLICATION_COMMANDS: boolean = false;
	let AUTO_DEFER_MESSAGE_COMPONENTS: boolean = false;

	return {
		getApplicationId: () => APPLICATION_ID,
		setApplicationId: (id: Snowflake) => {
			APPLICATION_ID = id;
		},
		getAutoDeferApplicationCommands: () => AUTO_DEFER_APPLICATION_COMMANDS,
		setAutoDeferApplicationCommands: (enable: boolean) => {
			AUTO_DEFER_APPLICATION_COMMANDS = enable;
		},
		getAutoDeferMessageComponents: () => AUTO_DEFER_MESSAGE_COMPONENTS,
		setAutoDeferMessageComponents: (enable: boolean) => {
			AUTO_DEFER_MESSAGE_COMPONENTS = enable;
		},
	};
})();
