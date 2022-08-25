import { InteractionResponseType } from "discord-api-types/v10";
import { isValidRequest, PlatformAlgorithm } from "discord-verify";

export const config = {
	runtime: "experimental-edge",
};

const PUBLIC_KEY = "123abc";

export default async (request: Request) => {
	if (request.method !== "POST" || request.body == null) {
		return new Response(JSON.stringify({ message: "Method Not Allowed" }), {
			status: 405,
			headers: {
				"content-type": "application/json",
			},
		});
	}

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

	return new Response(JSON.stringify({ type: InteractionResponseType.Pong }), {
		headers: {
			"content-type": "application/json",
		},
	});
};
