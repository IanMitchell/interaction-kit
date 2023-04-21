import { MockAgent, setGlobalDispatcher } from "undici";
import type { MockInterceptor } from "undici/types/mock-interceptor";

const agent = new MockAgent();
agent.disableNetConnect();
setGlobalDispatcher(agent);

export const mockPool = agent.get("https://discord.com");

export function intercept(
	path: string,
	options: Omit<MockInterceptor.Options, "path"> = {}
) {
	return mockPool.intercept({
		...options,
		path: `/api/v10${path}`,
	});
}
