import { expect, vi } from "vitest";
import { client } from "../../src/client.js";

export async function runAuditLogTest(
	// TODO: Should probably infer this somehow instead of hardcoding it
	method: "post" | "patch" | "delete" | "put" | "get",
	callback: () => Promise<string>
) {
	const spy = vi.spyOn(client, method).mockImplementation(async () => "");

	const reason = await callback();

	expect(spy).toHaveBeenCalledWith(expect.anything(), {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		body: expect.anything(),
		headers: new Headers({ "X-Audit-Log-Reason": reason }),
	});
}
