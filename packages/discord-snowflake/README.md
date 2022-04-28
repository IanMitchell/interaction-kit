# discord-snowflake

discord-snowflake is a library for parsing [Discord Snowflakes](https://discord.com/developers/docs/reference#snowflakes).

## Usage

To install the package, run the following in your terminal:

```
npm install discord-snowflake
```

Then in your code import the library:

```js
import * as SnowflakeUtils from "discord-request";
```

## API

### `EPOCH`

A constant representing the Discord epoch.

```js
import { EPOCH } from "discord-snowflake";
```

### Type: `Snowflake`

A type representing a Discord Snowflake.

```ts
import type { Snowflake } from "discord-snowflake";
```

### Typeguard: `isSnowflake(id: string): boolean`

A typeguard function that returns whether the string is a valid Snowflake or not.

```js
import { isSnowflake } from "discord-snowflake";

console.log(isSnowflake("90339695967350784")); // true
```

### `getTimestamp(snowflake: Snowflake): number`

```js
import { getTimestamp } from "discord-snowflake";

console.log(getTimestamp("90339695967350784")); //
```

### `getDate(snowflake: Snowflake): Date`

```js
import { getDate } from "discord-snowflake";

console.log(getDate("90339695967350784"));
```

### `getWorkerId(snowflake: Snowflake): number`

```js

```

### `getProcessId(snowflake: Snowflake): Number`

```js

```

### `getIncrement(snowflake: Snowflake): number`

```js

```

### `parse(snowflake: Snowflake)`

```js

```

# Credits

Special thanks to [theking465](https://github.com/theking465) for the original package implementation.
