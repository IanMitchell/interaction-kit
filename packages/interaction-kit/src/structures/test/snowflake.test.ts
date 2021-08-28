import {
	getIncrement,
	getProcessID,
	getTimestamp,
	getWorkerID,
} from "../snowflake";

const snowflake = "176793948025520128";

describe("Snowflakes deconstruction", () => {
	test("timestamp", () => {
		expect(getTimestamp(snowflake)).toStrictEqual(new Date(1462221361882));
	});
	test("worker ID", () => {
		expect(getWorkerID(snowflake)).toBe(0);
	});
	test("process ID", () => {
		expect(getProcessID(snowflake)).toBe(0);
	});
	test("increment", () => {
		expect(getIncrement(snowflake)).toBe(0);
	});
});