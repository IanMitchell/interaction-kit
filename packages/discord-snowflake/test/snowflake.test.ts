import {
	getIncrement,
	getProcessId,
	getTimestamp,
	getWorkerId,
} from "../src/snowflake";

// TODO: Write Tests

const snowflake = "176793948025520128";

test("timestamp", () => {
	expect(getTimestamp(snowflake)).toStrictEqual(new Date(1462221361882));
});

test("worker Id", () => {
	expect(getWorkerId(snowflake)).toBe(0);
});

test("process Id", () => {
	expect(getProcessId(snowflake)).toBe(0);
});

test("increment", () => {
	expect(getIncrement(snowflake)).toBe(0);
});
