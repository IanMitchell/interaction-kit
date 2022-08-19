import { expect, test } from "vitest";
import {
	getDate,
	getIncrement,
	getProcessId,
	getTimestamp,
	getWorkerId,
	isSnowflake,
	parse,
} from "../src/snowflake.js";

const snowflake = "90339695967350784";

test("isSnowflake", () => {
	expect(isSnowflake(snowflake)).toBe(true);

	expect(() => isSnowflake("string")).toThrow();
	// @ts-expect-error intentional test
	expect(isSnowflake(123)).toBe(false);
});

test("getTimestamp", () => {
	expect(getTimestamp(snowflake)).toStrictEqual(1441609061949);
});

test("getDate", () => {
	expect(getDate(snowflake)).toStrictEqual(new Date(1441609061949));
});

test("getWorkerId", () => {
	expect(getWorkerId(snowflake)).toBe(0);
});

test("getProcessId", () => {
	expect(getProcessId(snowflake)).toBe(3);
});

test("getIncrement", () => {
	expect(getIncrement(snowflake)).toBe(0);
});

test("parse", () => {
	expect(parse(snowflake)).toEqual({
		timestamp: 1441609061949,
		workerId: 0,
		processId: 3,
		increment: 0,
	});
});
