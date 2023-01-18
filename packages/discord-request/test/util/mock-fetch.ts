import { MockAgent, setGlobalDispatcher } from "undici";

export function setMockResponse(
	{
		status,
		body,
		headers,
	}: {
		status: number;
		body: Record<string, unknown>;
		headers?: Record<string, string>;
	},
	path = ""
) {
	const mockAgent = new MockAgent();
	mockAgent.disableNetConnect();

	setGlobalDispatcher(mockAgent);

	const mockPool = mockAgent.get("https://discord.com");
	mockPool
		.intercept({ path: `/api/v10/${path}` })
		.reply(status, body, { headers });
}
