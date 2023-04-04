# notes:

- On request
  - Read retry-after
  - If we aren't there yet, throw RateLimitError immediately
  - Otherwise, send request
- On 429, die
  - set retry-after value
  - throw RateLimitError
  - let user handle

do but not listed

- set remaining
- read remaining

Add stragies for rate limits

- Throw immediately (serverless)
- sleep and queue requests (server)

# discord-request

> **Looking for an API Wrapper?**
> Check out [`discord-api`](https://www.npmjs.com/package/discord-api) instead. This package is low level, and works best in libraries as opposed to applications.

A Discord HTTP client that handles global and resource rate limits automatically.

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

const instance = new Client();
client.setToken(process.env.DISCORD_TOKEN);

const guildCommands = client.get(
	Routes.applicationGuildCommands(applicationId, guildId)
) as Promise<RESTGetAPIApplicationGuildCommandsResult>;
```

## Options

When creating a new client, you can configure it by passing in optional arguments:

```ts
const instance = new Client({
	retries: 0,
	timeout: 1000,
	globalRequestsPerSecond: 100,
	onRateLimit: (data) => console.log({ data }),
}).setToken(process.env.DISCORD_TOKEN);
```

Every parameter listed below is optional.

- `api`: The API URL to use. Defaults to `https://discord.com/api`.
- `version`: The API version to use. Defaults to `10`.
- `cdn`: The CDN URL to use. Defaults to `https://cdn.discordapp.com`.
- `headers`: An object of additional headers to send with each request.
- `userAgent`: The user agent to use. Defaults to `Discord Request v0`.
- `retries`: The number of times to retry a request if it fails. Defaults to `3`.
- `timeout`: The number of milliseconds to wait before timing out a request. Defaults to `15000` (15 seconds).
- `globalRequestsPerSecond`: The number of global requests per second to allow. Defaults to `50`.
- `shutdownSignal`: An AbortSignal to use when you need to cancel all unfinished requests to shut down the application.
- `queueSweepInterval`: The number of milliseconds to wait between sweeping the queue. Defaults to `0` (no sweeping). **If you use discord-request in a persistent environment, you should set this value.**
- `bucketSweepInterval`: The number of milliseconds to wait between sweeping the buckets. Defaults to `0` (no sweeping). **If you use discord-request in a persistent environment, you should set this value.**
- `onBucketSweep`: See callbacks below.
- `onQueueSweep`: See callbacks below.
- `onRateLimit`: See callbacks below.
- `onRequest`: See callbacks below.

#### Callbacks

###### `onBucketSweep?: (swept: Map<string, Bucket>) => void;`

Runs when a bucket sweep finishes. Returns a Map of removed buckets.

###### `onQueueSweep?: (swept: Map<string, Queue>) => void;`

Runs when a queue sweep finishes. Returns a Map of removed queues.

###### `onRateLimit?: (data: RateLimitData) => void;`

Runs when a rate limit is encountered. Returns information about the rate limit.

###### `onRequest?: (parameters: Route, resource: string, init: RequestInit, options: RequestOptions, retries: number) => void;`

Runs when a request is sent to the Discord API. Returns information used to send the request.

## Client Configuration

You can configure the client with the following accessors:

- `userAgent`:
- `abortSignal`:
- `globalRequestsPerSecond`:
- `api`:
- `requestConfig`
- `sweepIntervals`:
- `callbacks`:

In addition, the follow accessors are availble to read current configuration with:

- `isSweeping`:
- `userAgent`:
- `abortSignal`:
- `globalRequestsPerSecond`:
- `api`:
- `requestConfig`
- `sweepIntervals`:
- `callbacks`:

## Setting Token

To set an application token for the client to use, call `setToken` after you instantiate it.

```ts
const instance = new Client();
instance.setToken(process.env.DISCORD_TOKEN);
```

## Request Errors

TODO!

## Credits

This code is derived from code originally written by the discord.js maintainers in the [@discordjs/rest](https://www.npmjs.com/package/@discordjs/rest) package and distributed under the Apache 2 license. It was changed to be built with Web APIs instead of Node.js APIs.
