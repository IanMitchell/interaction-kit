# discord-request

This library provides a very low-level request queue for the Discord HTTP API. It allows libraries to write abstractions on top of it while automatically handling Discord rate limits.

## Installation and Usage

> If you aren't coding a Discord library, this package probably isn't the best tool for you to use. Instead, look to [discord.js]() or [Interaction Kit]() for better, more abstract API handlers.

To install this library, run:

```
npm install discord-request
```

You can then import the client like so:

```javascript
import Client from "discord-request";

const id = "123";
Client.get(
	`https://discord.com/api/v9/guilds/${id}`,
	{
		headers: {
			"user-agent": `InteractionKit (https://interactionkit.dev, 1.0.0)`,
			"Content-Type": "application/json",
		},
	},
	{
		route: "[GET] /guilds/{guild.id}",
		identifier: id,
	}
);
```

## API

You should exclusively use the HTTP method helpers on the Client export.

**GET Requests**

```javascript
Client.get(url: URL, options: RequestInit, bucket: BucketClassifier)
```

**POST Requests**

```javascript
Client.post(url: URL, options: RequestInit, bucket: BucketClassifier)
```

**PATCH Requests**

```javascript
Client.patch(url: URL, options: RequestInit, bucket: BucketClassifier)
```

**PUT Requests**

```javascript
Client.put(url: URL, options: RequestInit, bucket: BucketClassifier)
```

**DELETE Requests**

```javascript
Client.delete(url: URL, options: RequestInit, bucket: BucketClassifier)
```

### URL and Options

The first two parameters are passed straight to `fetch`.

### BucketClassifier

The third option provides information for the [Rate Limit Bucket](). The object has two fields - `route` and `identifier`.

**route** should be a string representation of the API route you're hitting. Do not interpolate ids or other variables into this string, but leave static descriptors instead. You should also include HTTP method information. For instance, `[GET] /guilds/{guild.id}` is a good route string.

**identifier** is the primary bucket identifier. This will be one of three items - Guild ID, Channel ID, or the combined string of your Webhook ID + Webhook Token.

## Example Library Usage and Reference

You can find an example abstractions built upon this library here:

- [Interaction Kit]()
