import { MockAgent, setGlobalDispatcher } from "undici";

export function getMockClient() {
	const mockAgent = new MockAgent();
	mockAgent.disableNetConnect();

	setGlobalDispatcher(mockAgent);

	return mockAgent.get("https://discord.com");
}

export function setMockResponse({
	status,
	body,
	headers = { "Content-Type": "application/json" },
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
	const client = getMockClient();

	client
		.intercept({ path: `/api/v10/${path}`, method })
		.reply(status, body, { headers })
		.times(times);

	return client;
}
