# discord-request

> **Looking for an API Wrapper?**
> Check out [`discord-api`](https://www.npmjs.com/package/discord-api) instead. This package is low level, and works best in libraries as opposed to applications.

A Discord HTTP client that handles global and resource rate limits automatically.

## Usage

This package works best in conjuction with [`discord-api-types`](https://www.npmjs.com/package/discord-api-types). To begin, install both:

    npm install discord-api discord-api-types

Then you can combine the two (with or without typing the results):

```ts
import Client from "discord-request";
import {
	Routes,
	RESTGetAPIApplicationGuildCommandsResult,
} from "discord-api-types/v10";

const instance = new Client();

const guildCommands = client.get(
	Routes.applicationGuildCommands(applicationId, guildId)
) as Promise<RESTGetAPIApplicationGuildCommandsResult>;
```

## Options

TODO

## Credits

This code is heavily inspired and derived from code originally written by the discord.js maintainers in the [@discordjs/rest](https://www.npmjs.com/package/@discordjs/rest) package.
