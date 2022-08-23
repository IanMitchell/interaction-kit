import type { APIInteraction } from "discord-api-types/v10";
import {
	InteractionResponseType,
	InteractionType,
} from "discord-api-types/v10";
import { isValidRequest, PlatformAlgorithm } from "discord-verify";

export const config = {
	runtime: "experimental-edge",
};

const PUBLIC_KEY = "123abc";

export default async (request: Request, response: Response) => {
	const isValid = await isValidRequest(
		request,
		PUBLIC_KEY,
		PlatformAlgorithm.Vercel
	);

	if (!isValid) {
		return new Response(JSON.stringify({ error: "Invalid Signature" }), {
			status: 401,
		});
	}

	const interaction = request.body as APIInteraction;

	if (interaction.type === InteractionType.Ping) {
		return new Response(JSON.stringify({ type: InteractionResponseType.Pong }));
	}

	return new Response(
		JSON.stringify({ content: "Hello World!", flags: 1 << 6 })
	);
};
