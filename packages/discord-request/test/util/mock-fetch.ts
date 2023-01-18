import { MockAgent, setGlobalDispatcher } from "undici";

export function setMockResponse({
	status,
	body,
	headers,
	method = "GET",
	path = "",
	times = 1,
}: {
	status: number;
	body: Record<string, unknown>;
	headers?: Record<string, string>;
	method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
	path?: string;
	times?: number;
}) {
	const mockAgent = new MockAgent();
	mockAgent.disableNetConnect();

	setGlobalDispatcher(mockAgent);

	const mockPool = mockAgent.get("https://discord.com");
	mockPool
		.intercept({ path: `/api/v10/${path}`, method })
		.reply(status, body, { headers })
		.times(times);

	return mockPool;
}
