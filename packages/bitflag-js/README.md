# bitflag-js

This package provides a class for working with bitflag fields. These structures are very useful as a way to condense a list of boolean values into a single number. They are perfect matches for things like user flags, permissions, and more.

bitflag-js is written in TypeScript and uses [bigints](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) instead of numbers.

## Usage

Install this package by running

```
npm install bitflag-js
```

Then import and use it in your code like this:

```ts
import { BitField } from "bitflags-js";

const UserBadges = {
	VERIFIED: 1n << 0n,
	CONTRIBUTOR: 1n << 1n,
	SUPPORTER: 1n << 2n,
	VIP: 1n << 3n,
};

const bitfield = new BitField();
bitfield.add(UserBadges.VERIFIED);
bitfield.add(UserBadges.CONTRIBUTOR);

if (bitfield.has(UserBadges.VERIFIED)) {
	console.log("This user is verified!");
}

console.log(bitfield.value);
```

## Types

This package is developed in TypeScript and exports two helper types.

### BitFlags

Use the `BitFlags` type when you are defining a list of bit flags.

```ts
import type { BitFlags } from "bitflag-js";

const UserBadges: BitFlags = {
	VERIFIED: 1n << 0n,
	CONTRIBUTOR: 1n << 1n,
	SUPPORTER: 1n << 2n,
	VIP: 1n << 3n,
};
```

### BitFlagResolvable

Use the `BitFlagResolvable` type to define a list of accepted values the BitField class can resolve.

```ts
import type { BitFlagResolvable } from "bitflag-js";

interface User {
	// ...
	flags: BitField;
}

export function addFlagToUser(user: User, flag: BitFlagResolvable) {
	user.flags.add(flag);
}
```

For more information about the resolvable types, refer to the documentation for BitField#resolve.

## BitField Static APIs

The BitField class has static API methods available.

### static resolve(...values: BitFlagResolvable[]): bigint {

Resolves an array of `BitFlagResolvable` to a bitfield value. This method accepts the following types:

- `number`
- `bigint`
- `BitField` instance
- An array of any of the above

```ts
const first = 1n << 0n;
const second = 1n << 1n;
const value = BitField.resolve(first, second);
```

All the instance methods call this method internally as a convenience.

## BitField Instance APIs

### constructor(...value: BitFlagResolvable[])

Creates a new BitField instance with an optional initial value.

```ts
const bitfield = new BitField();
const bitfield = new BitField(1n << 0n, 1n << 1n);
```

### get value(): bigint

Returns the computed value of the bitfield.

### set(flag: BitFlagResolvable, value: boolean)

Sets or unsets a flag.

```ts
const bitfield = new BitField();
bitfield.set(1n << 0n, true);
bitfield.set(1n << 1n, false);
```

### add(...flags: BitFlagResolvable[])

Sets one or more flags.

```ts
const bitfield = new BitField();
bitfield.add(1n << 0n);
bitfield.add(1n << 1n);
```

### has(...flags: BitFlagResolvable[])

Checks if the bitfield has one or more flags.

```ts
const bitfield = new BitField();
bitfield.add(1n << 0n);

bitfield.has(1n << 0n); // true
bitfield.has(1n << 1n); // false
```

### remove(...flags: BitFlagResolvable[])

Removes one or more flags.

```ts
const bitfield = new BitField(1n << 0n, 1n << 1n);
bitfield.remove(1n << 0n);
```

### mask(...flags: BitFlagResolvable[])

Returns the union of the bitfield and the given flags. This is useful when you have a single field for your flags that mixes public and private values.

```ts
const flags = {
	PRIVATE: 1n << 0n,
	PUBLIC: 1n << 1n,
	PUBLIC_TWO: 1n << 2n,
};

const PUBLIC_API_MASK = [flags.PUBLIC, flags.PUBLIC_TWO];

const bitfield = new BitField(Flags.PRIVATE, Flags.PUBLIC);

bitfield.mask(PUBLIC_API_MASK); // returns Flags.PUBLIC, because it's the only shared value between the bitfield value and the PUBLIC_API_MASK variable.
```

This field does **not** modify the underlying value. To do that, use `BitField#set`.

### \\*\[Symbol.iterator]()

This is less intimidating than it looks! It lets you reference flags in a BitField using the `for...of` syntax.

```ts
const bitfield = new BitField();
bitfield.add(1n << 0n);
bitfield.add(1n << 1n);

for (const flag of bitfield) {
	console.log(flag);
}
```

### toJSON()

Returns the value of the bitfield as a number if able, or a string if not.

```ts
const bitfield = new BitField();
bitfield.add(1n << 0n);
bitfield.add(1n << 1n);

bitfield.toJSON(); // a number

bitfield.add(1n << 64n);
bitfield.toJSON(); // a string (value > Number.MAX_SAFE_INTEGER)
```

To force the return value to always be a string, use `BitField#toString`.

### toString()

Returns the value of the bitfield as a string.

```ts
const bitfield = new BitField();
bitfield.add(1n << 0n);
bitfield.add(1n << 1n);

bitfield.toString(); // a string
```
