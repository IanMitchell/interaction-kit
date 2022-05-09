# discord-api

A wrapper around the Discord REST API. This package is built on top of `discord-request` and `discord-api-types` - it is fully typed and handles rate limits appropriately.

**Requires Node v18+ or a ServiceWorker Environment**

## Installation

Install the package by running

    npm install discord-api

## Example Usage

```ts
import { client } from "discord-api";

try {
	const response = await client.postGlobalApplicationCommand(
		process.env.APPLICATION_ID,
		payload
	);
} catch (error: unknown) {
	console.error((error as Error).message);
}
```

## Client Options

TODO

## Endpoint Documentation

For a full list of endpoints, please [visit the documentation]().
