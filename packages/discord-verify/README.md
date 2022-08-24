# discord-verify

This package is used to [efficiently verify](https://twitter.com/advaithj1/status/1420696472933175297?s=20&t=c5SiC7uVVVDkApYrrbrY0Q) Discord HTTP interactions.

## Performance

The following graphs show the real world metrics of [Truth or Dare](https://truthordarebot.xyz/) running [discord-interactions] version 3.2.0 on the left and `discord-verify` version 1.0.0 on the right. At the time, Truth or Dare was in 640,000 servers and running on a machine with an Intel Xeon E5-2630 CPU and 16GB of RAM. It averaged 55% CPU usage and 450ms event loop lag. After switching to `discord-verify`, the CPU usage dropped to 5% and the event loop lag dropped to 10ms.

![discord-interactions](https://github.com/IanMitchell/interaction-kit/blob/main/assets/discord-verify-tod.png?raw=true)

By using native WebCrypto instead of `tweetnacl` discord-verify achieves significantly better performance compared to discord-interactions.

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

### Custom Verification

If you want to verify requests from frameworks such as Express or Fastify that have their own request classes, you can import the verify function and pass raw values to it.

```ts
import { verify } from "discord-verify/node";

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

	const isValid = await verify(
		rawBody,
		signature,
		timestamp,
		this.client.publicKey,
		crypto.webcrypto.subtle
	);

	if (!isValid) {
		return res.code(401).send("Invalid signature");
	}
}
```

#### Node 18.3 and Older (Excluding Node 16.17.0 or newer v16 versions)

If you are using Node 17 or lower, you need to make some changes:

```diff
+ import { verify, PlatformAlgorithms } from "discord-verify/node";

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

	const isValid = await verify(
		rawBody,
		signature,
		timestamp,
		this.client.publicKey,
		crypto.webcrypto.subtle,
+		PlatformAlgorithms.OldNode
	);

	if (!isValid) {
		return res.code(401).send("Invalid signature");
	}
}
```

If you see a runtime DOMException about the the name, applying these changes should fix it.

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

## Credits

- [devsnek](https://github.com/devsnek) for the [initial gist](https://gist.github.com/devsnek/77275f6e3f810a9545440931ed314dc1) this package is based on.
- [kyranet](https://github.com/kyranet) for an improved hex string parser.
