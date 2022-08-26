import { describe, test } from "vitest";

test.todo("Can update Token");

describe("Abort Signal", () => {
	test.todo("Handles Abort Signal");

	test.todo("Can update Abort Signal");
});

describe("Rate Limits", () => {
	test.todo("Can update Global Delay");

	test.todo("Can interrupt Global Delay with Abort Signal");

	test.todo("Updates Global Timeout Flag");

	test.todo("Updates Global Limited Flag");
});

describe("Buckets", () => {
	test.todo("Creates a global bucket if none exist");

	test.todo("Matches bucket if one exists");
});

describe("Queues", () => {
	test.todo("Creates new Queues if no match exists");

	test.todo("Uses existing Queue if one exists");

	test.todo("Can add Request to Queue");
});

describe("Sweeps", () => {
	test.todo("Sweeps don't start with Interval 0");

	test.todo("Old buckets are removed and returned");

	test.todo("Sweeps can be cleared");
});

describe("API URL", () => {
	test.todo("Handles old API versions");

	test.todo("Handles Query Parameters");
});

describe("Headers", () => {
	test.todo("Handles Authorization");

	test.todo("Handles Audit Log");
});

describe("Attachment Requests", () => {
	test.todo("Handles Basic Attachments");

	test.todo("Handles Attachments with Metadata");

	test.todo("Handles Attachments with extra FormData");
});

describe("Requests", () => {
	test.todo("Handles Raw Request Bodies");

	test.todo("Handles JSON Request Bodies");
});
