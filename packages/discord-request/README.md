# discord-request

> **Looking for an API Wrapper?**
> Check out [`discord-api-methods`](https://www.npmjs.com/package/discord-api-methods) instead. This package is low level, and works best in libraries as opposed to applications.

A Discord HTTP client that handles formatting and parsing requests.

## Usage

This package works best in conjuction with [`discord-api-types`](https://www.npmjs.com/package/discord-api-types). To begin, install both:

    npm install discord-api discord-api-types

Then you can combine the two (with or without typing the results):

```ts
import { Client } from "discord-request";
import {
	Routes,
	RESTGetAPIApplicationGuildCommandsResult,
} from "discord-api-types/v10";

const client = new Client();
client.setToken(process.env.DISCORD_TOKEN);

const guildCommands = client.get(
	Routes.applicationGuildCommands(applicationId, guildId)
) as Promise<RESTGetAPIApplicationGuildCommandsResult>;
```

## Options

When creating a new client, you can configure it by passing in optional arguments:

```ts
const instance = new Client({
	timeout: 1000,
	userAgent: "My Discord Bot",
}).setToken(process.env.DISCORD_TOKEN);
```

Every parameter listed below is optional.

- `api`: The API URL to use. Defaults to `https://discord.com/api`.
- `version`: The API version to use. Defaults to `10`.
- `cdn`: The CDN URL to use. Defaults to `https://cdn.discordapp.com`.
- `headers`: An object of additional headers to send with each request.
- `userAgent`: The user agent to use. Defaults to `Discord Request v0`.
- `timeout`: The number of milliseconds to wait before timing out a request. Defaults to `15000` (15 seconds).
- `abortSignal`: An AbortSignal to use when you need to cancel all unfinished requests to shut down the application.
- `onRequest`: See callbacks below.

#### Callbacks

###### `onRequest?: (path: string, init: RequestInit) => void;`

Runs when a request is sent to the Discord API. Passes information used to send the request.

## Client Configuration

There are various getters and setters you can use to configure the client once instantiated.

```ts
const instance = new Client();
instance.userAgent = "My Discord Bot";
console.log(instance.userAgent);
```

## Setting Token

To set an application token for the client to use, call `setToken` after you instantiate it.

```ts
const instance = new Client();
instance.setToken(process.env.DISCORD_TOKEN);
```

## Request Errors

This library will throw several different errors based on the response.

- `RequestError` - If the request fails for any reason, this error will be thrown with the error message.
- `RateLimitError` - If your application is currently being Rate Limited by Discord, this error will be thrown with the parsed information.
- `DiscordRequestError` - If Discord's API returns an error with an error key, this error will be thrown with the parsed information.

## Credits

This code is derived from code originally written by the discord.js maintainers in the [@discordjs/rest](https://www.npmjs.com/package/@discordjs/rest) package and distributed under the Apache 2 license. It was changed to be built with Web APIs instead of Node.js APIs.
