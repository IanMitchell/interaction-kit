# discord-snowflake

discord-snowflake is a library for parsing [Discord Snowflakes](https://discord.com/developers/docs/reference#snowflakes).

## Usage

To install the package, run the following in your terminal:

```
npm install discord-snowflake
```

Then in your code import the library:

```js
import * as SnowflakeUtils from "discord-snowflake";
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

console.log(isSnowflake("90339695967350784"));
// => true
```

### `getTimestamp(snowflake: Snowflake): number`

```js
import { getTimestamp } from "discord-snowflake";

console.log(getTimestamp("90339695967350784"));
// => 1441609061949
```

### `getDate(snowflake: Snowflake): Date`

```js
import { getDate } from "discord-snowflake";

console.log(getDate("90339695967350784"));
// =>  2015-09-07T06:57:41.949Z (date object)
```

### `getWorkerId(snowflake: Snowflake): number`

```js
import { getWorkerId } from "discord-snowflake";

console.log(getWorkerId("90339695967350784"));
// => 0
```

### `getProcessId(snowflake: Snowflake): Number`

```js
import { getProcessId } from "discord-snowflake";

console.log(getProcessId("90339695967350784"));
// => 3
```

### `getIncrement(snowflake: Snowflake): number`

```js
import { getIncrement } from "discord-snowflake";

console.log(getIncrement("90339695967350784"));
// => 0
```

### `parse(snowflake: Snowflake)`

```js
import { parse } from "discord-snowflake";

console.log(parse("90339695967350784"));
// => { timestamp: 1441609061949, workerId: 0, processId: 3, increment: 0 }
```

# Credits

Special thanks to [theking465](https://github.com/theking465) for the original package implementation.
