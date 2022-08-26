import { performance } from "node:perf_hooks";
import { expect, test } from "vitest";
import { sleep } from "../src/util/time.js";

test("sleep can be aborted", async () => {
	const controller = new AbortController();

	const start = performance.now();

	const promise = sleep(5000, controller.signal);
	console.log("Aborting");
	controller.abort();
	await expect(promise).rejects.toThrowError("aborted");

	const end = performance.now();

	expect(start - end).toBeLessThan(100);
});
