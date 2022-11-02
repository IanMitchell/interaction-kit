# discord-edge-runner

This package compiles and runs a Discord HTTP interactions bot from an Edge VM. It is intended for use when locally developing JavaScript or TypeScript HTTP bots.

This package will automatically watch your bot's source files for changes and live reload when one is detected.

## Usage

> **Note:** If you are using Interaction Kit, the library handles the usage of this library for you. This package is primarily intended for library authors.

```bash
npm i -D discord-edge-runner
```

In your development script you can then use the package like this:

```typescript
import server from "discord-edge-runner";

const runner = await server({
	entrypoint: "./bot.ts",
	port: 3000,
	env: {
		APPLICATION_ID: process.env.APPLICATION_ID,
		PUBLIC_KEY: process.env.PUBLIC_KEY,
		TOKEN: process.env.TOKEN,
		// Handle the output from the "debug" npm package.
		DEBUG: process.env.DEBUG ?? "",
		DEBUG_COLORS: "ON",
		// Chalk
		FORCE_COLOR: "1",
	},
	onReload: async () => {
		// When the bot reloads, update its commands on Discord
		await updateCommands(guildId);
	},
	onError: (error: unknown) => {
		log(chalk.red({ error }));
	},
});
```
