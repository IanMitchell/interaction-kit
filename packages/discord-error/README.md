# discord-error

Creates a JavaScript Error from the body response of a Discord API JSON error message. It is intended to be used primarily in libraries rather than client code.

## Usage

```js
import { DiscordError, isDiscordError } from "discord-error";

// This should be the incoming interaction request
const request = new Request();

// A request to the Discord API that performs some action
const response = await fetch(DISCORD_API, { ...options });

if (!response.ok) {
	const data = await response.json();
	const label = isDiscordError(data) ? data.code : data.error;
	throw new DiscordError(request, response, label, data);
}
```

## Credits

This code is heavily inspired and derived from code originally written by the discord.js maintainers in the [@discordjs/rest](https://www.npmjs.com/package/@discordjs/rest) package.
