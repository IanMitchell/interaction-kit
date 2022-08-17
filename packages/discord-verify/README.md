# discord-verify

This package is used to [efficiently verify](https://twitter.com/advaithj1/status/1420696472933175297?s=20&t=c5SiC7uVVVDkApYrrbrY0Q) Discord HTTP interactions.

## Installation

```bash
npm install discord-verify
```

## Usage

### Web Environments

```js
import { isValidRequest } from "discord-verify";

const isValid = await isValidRequest(request, publicKey);
```

### Node Environments

```js
import { isValidRequest } from "discord-verify/node";

const isValid = await isValidRequest(request, publicKey);
```

### Custom Validation

If you want to validate requests from frameworks such as Express or Fastify that have their own request classes, you can import the validate function and pass raw values to it.

```ts
import { validate } from "discord-verify/node";

async function handleRequest(
	req: FastifyRequest<{
		Body: APIInteraction;
		Headers: {
			"x-signature-ed25519": string;
			"x-signature-timestamp": string;
		};
	}>,
	res: FastifyReply
) {
	const signature = req.headers["x-signature-ed25519"];
	const timestamp = req.headers["x-signature-timestamp"];
	const rawBody = JSON.stringify(req.body);

	const isValid = await validate(
		rawBody,
		signature,
		timestamp,
		this.client.publicKey,
		crypto.subtle
	);

	if (!isValid) {
		return res.code(401).send("Invalid signature");
	}
}
```

#### Node 17 and Older

If you are using Node 17 or lower, you need to make some changes:

```diff
+ import { webcrypto } from "node:crypto";
+ import { validate, PlatformAlgorithms } from "discord-verify/node";

async function handleRequest(
	req: FastifyRequest<{
		Body: APIInteraction;
		Headers: {
			"x-signature-ed25519": string;
			"x-signature-timestamp": string;
		};
	}>,
	res: FastifyReply
) {
	const signature = req.headers["x-signature-ed25519"];
	const timestamp = req.headers["x-signature-timestamp"];
	const rawBody = JSON.stringify(req.body);

	const isValid = await validate(
		rawBody,
		signature,
		timestamp,
		this.client.publicKey,
-		crypto.subtle
+		webcrypto.subtle,
+		PlatformAlgorithms.Node16
	);

	if (!isValid) {
		return res.code(401).send("Invalid signature");
	}
}
```

### Options

`isValidRequest` takes an optional third argument to specify the algorithm to use. This can be a string or object containing `name` and `namedCurve`. For convenience, `discord-verify` exports `PlatformAlgorithm` that contains values used by common platforms. You can use it like this:

```js
import { isValidRequest, PlatformAlgorithm } from "discord-verify";

const isValid = await isValidRequest(
	request,
	publicKey,
	PlatformAlgorithm.Vercel
);
```

The following platforms are currently supported:

- Vercel
- CloudFlare
