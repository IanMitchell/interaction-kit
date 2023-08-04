import { describe, expect, test } from "vitest";
import type { BitFlags } from "../src/bitfield.js";
import { BitField } from "../src/bitfield.js";

const Flags: BitFlags = {
	FIRST: 1n << 1n,
	SECOND: 1n << 2n,
	THIRD: 1n << 3n,
	FOURTH: 1n << 4n,
	FIFTH: 1n << 5n,
};

describe("resolve", () => {
	test("Handles numbers", () => {
		expect(BitField.resolve(1 << 1)).toEqual(Flags.FIRST);
		expect(BitField.resolve(1 << 5)).toEqual(Flags.FIFTH);
	});

	test("Handles bigints", () => {
		expect(BitField.resolve(Flags.FIRST)).toEqual(Flags.FIRST);
		expect(BitField.resolve(Flags.FIFTH)).toEqual(Flags.FIFTH);
	});

	test("Handles Arrays", () => {
		expect(BitField.resolve([Flags.FIRST, Flags.SECOND, Flags.THIRD])).toEqual(
			14n
		);
		expect(BitField.resolve([Flags.FIRST, Flags.THIRD, Flags.FIFTH])).toEqual(
			42n
		);
	});

	test("Handles multiple values", () => {
		expect(BitField.resolve(Flags.FIRST, Flags.SECOND)).toEqual(6n);
		expect(
			BitField.resolve(
				Flags.FIRST,
				Flags.SECOND,
				[Flags.THIRD, Flags.FOURTH, Flags.FIFTH],
				Flags.FIRST
			)
		).toEqual(62n);
	});

	test("Handles BitFields", () => {
		const bitfield = new BitField(Flags.FIFTH);
		expect(BitField.resolve(bitfield)).toEqual(Flags.FIFTH);
	});

	test("Rejects Strings", () => {
		// @ts-expect-error We are testing incorrect types
		expect(() => BitField.resolve("test")).toThrow(TypeError);
	});

	test("Rejects incorrect argument types", () => {
		// @ts-expect-error We are testing incorrect types
		expect(() => BitField.resolve(null)).toThrow(TypeError);
		// @ts-expect-error We are testing incorrect types
		expect(() => BitField.resolve(undefined)).toThrow(TypeError);
	});
});

describe("constructor", () => {
	test("Defaults to 0", () => {
		const bf = new BitField();
		expect(bf.value).toEqual(0n);
	});

	test("Can Handle Arrays", () => {
		const bf = new BitField([Flags.FIRST, Flags.SECOND]);
		expect(bf.value).toEqual(6n);
	});

	test("Can Handle Multiple Args", () => {
		const bf = new BitField(Flags.FIRST, Flags.SECOND);
		expect(bf.value).toEqual(6n);
	});
});

test("get value", () => {
	const bf = new BitField(5n);
	expect(bf.value).toEqual(5n);
});

test("set", () => {
	const bf = new BitField();
	expect(bf.value).toEqual(0n);

	bf.set(Flags.FIRST, true);
	expect(bf.value).toEqual(2n);

	bf.set(Flags.FIRST, false);
	expect(bf.value).toEqual(0n);

	bf.set([Flags.SECOND, Flags.THIRD], true);
	expect(bf.value).toEqual(12n);

	bf.set(Flags.SECOND, false);
	expect(bf.value).toEqual(8n);
});

test("add", () => {
	const bf = new BitField();

	bf.add(Flags.FIRST);
	expect(bf.value).toEqual(2n);

	bf.add(Flags.SECOND, Flags.FOURTH);
	expect(bf.value).toEqual(22n);

	bf.add(Flags.FIRST, Flags.THIRD, Flags.FIFTH);
	expect(bf.value).toEqual(62n);
});

test("has", () => {
	const bf = new BitField(Flags.FIRST, Flags.SECOND, Flags.FOURTH);
	expect(bf.has(Flags.FIRST)).toBe(true);
	expect(bf.has(Flags.SECOND, Flags.FOURTH)).toBe(true);
	expect(bf.has(Flags.THIRD)).toBe(false);
	expect(bf.has([Flags.FIRST, Flags.FOURTH])).toBe(true);
});

test("remove", () => {
	const bf = new BitField(Flags.FIRST, Flags.SECOND, Flags.THIRD);

	bf.remove(Flags.FIRST);
	expect(bf.value).toEqual(12n);

	bf.remove(Flags.SECOND, Flags.FOURTH);
	expect(bf.value).toEqual(8n);

	bf.remove(Flags.THIRD, Flags.FIFTH);
	expect(bf.value).toEqual(0n);
});

test("mask", () => {
	const bf = new BitField(Flags.FIRST, Flags.SECOND, Flags.THIRD);
	expect(bf.mask(Flags.FIRST, Flags.THIRD, Flags.FIFTH)).toEqual(10n);

	bf.remove(Flags.SECOND);
	expect(bf.value).toEqual(10n);
});

test("iterator", () => {
	const bf = new BitField(Flags.FIRST, Flags.THIRD, Flags.FIFTH);
	const arr: bigint[] = [];

	for (const item of bf) {
		arr.push(item);
	}

	expect(arr.length).toBe(3);
	expect(arr).toEqual([Flags.FIRST, Flags.THIRD, Flags.FIFTH]);
});

describe("toJSON", () => {
	test("Converts Numbers", () => {
		const bf = new BitField(BigInt(Number.MAX_SAFE_INTEGER) - 1n);
		expect(bf.toJSON()).toBeTypeOf("number");
		expect(bf.toJSON()).toEqual(9007199254740990);
	});

	test("Converts BigInts to String", () => {
		const bf = new BitField(BigInt(Number.MAX_SAFE_INTEGER) + 1n);
		expect(bf.toJSON()).toBeTypeOf("string");
		expect(bf.toJSON()).toEqual("9007199254740992");
	});
});

describe("toString", () => {
	test("Converts to string", () => {
		const bf = new BitField(110n);
		expect(bf.toString()).toEqual("110");
	});
});
