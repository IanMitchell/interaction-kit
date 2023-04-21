# discord-request

> **Looking for an API Wrapper?**
> Check out [`discord-api-methods`](https://www.npmjs.com/package/discord-api-methods) instead. This package is low level, and works best in libraries as opposed to applications.

A Discord HTTP client that handles formatting and parsing requests.

## Usage

This package works best in conjuction with [`discord-api-types`](https://www.npmjs.com/package/discord-api-types). To begin, install both:

    npm install discord-request discord-api-types

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

## Sending Requests

To send a request, use the `get`, `post`, `patch`, `put`, or `delete` methods.

```ts
import { Client } from "discord-request";

const instance = new Client().setToken(process.env.DISCORD_TOKEN);
const route = "...";
let result;

// GET
result = await instance.get(route);

// POST
result = await instance.post(route, {
	body: {
		key: "value",
	},
});

// PUT
result = await instance.put(route, {
	body: {
		key: "value",
	},
});

// PATCH
result = await instance.patch(route, {
	body: {
		key: "value",
	},
});

// DELETE
result = await instance.delete(route);
```

## Request Options

You can pass these options to each HTTP request method. Every parameter listed below is optional.

- `authorization` (boolean): Whether to use the authorization header.
- `authorizationPrefix` (string): The authorization prefix to use. Defaults to "Bot".
- `formData` (FormData): The body to send as form data.
- `body` (BodyInit | object): The body to send with the request. If you have defined `formData` or `files` this will be sent as `payload_json` in the form data.
- `files` (Attachment[] | undefined): A list of up to 10 files to upload and send as part of the request.
  - `Attachment` objects should consist of an optional `id` snowflake (for editing existing attachments), a `name` string, and a `data` Blob.
- `headers` (HeadersInit): Headers to add to the request.
- `rawBody` (boolean, defaults to false): If true, the body will not be processed before sending to Discord.
- `query` (URLSearchParams): Query parameters to add to the request.
- `reason` (string): If provided, an audit log entry will be made with this value.
- `versioned` (boolean): A boolean on whether to use the versioned API. By default, requests will set a specific API version.

## Request Errors

This library will throw several different errors based on the response.

- `RequestError` - If the request fails for any reason, this error will be thrown with the error message.
- `RateLimitError` - If your application is currently being Rate Limited by Discord, this error will be thrown with the parsed information.
- `DiscordRequestError` - If Discord's API returns an error with an error key, this error will be thrown with the parsed information.

## Credits

This code is derived from code originally written by the discord.js maintainers in the [@discordjs/rest](https://www.npmjs.com/package/@discordjs/rest) package and distributed under the Apache 2 license. It was changed to be built with Web APIs instead of Node.js APIs.
