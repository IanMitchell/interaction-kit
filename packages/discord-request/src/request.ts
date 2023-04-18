import type { ErrorBody } from "discord-error";
import { DiscordError, isDiscordError } from "discord-error";
import type { Client } from "./client.js";
import { RateLimitError } from "./errors/rate-limit-error.js";
import { RequestError } from "./errors/request-error.js";
import { parse } from "./response.js";

export async function request(
	client: Client,
	path: string,
	init: RequestInit,
	abortSignal: AbortSignal | null | undefined
): Promise<ArrayBuffer | JSON | Response> {
	// Setup the timeout signal
	const signal = new AbortController();
	const abortRequest = () => {
		signal.abort();
		clearAbort();
	};

	const abortTimeout = setTimeout(abortRequest, client.timeout);
	const clearAbort = () => {
		clearTimeout(abortTimeout);
	};

	abortSignal?.addEventListener("abort", abortRequest);

	// Callbacks
	client.onRequest?.(path, init);

	// Send the request
	const request = new Request(path, init);
	let response: Response;

	// Failed requests should bubble up
	try {
		response = await fetch(request, { signal: signal.signal });
	} finally {
		abortSignal?.removeEventListener("abort", abortRequest);
		clearAbort();
	}

	// Successful Requests
	if (response.ok) {
		return parse(response);
	}

	// Rate Limited Requests
	if (response.status === 429) {
		throw new RateLimitError(response);
	}

	// If given a server error, retry the request
	if (response.status >= 500 && response.status < 600) {
		throw new RequestError(
			path,
			init,
			// `response` has not yet been consumed by this point, it is safe to pass an uncloned version
			response
		);
	}

	// Handle non-ratelimited bad requests
	if (response.status >= 400 && response.status < 500) {
		// If we receive a 401 status code, it means the token we had is no longer valid.
		const isAuthRequest = new Headers(init.headers).has("Authorization");
		if (response.status === 401 && isAuthRequest) {
			client.setToken(null);
		}

		// Handle unknown API errors
		const data: ErrorBody = await response.json();
		const label = isDiscordError(data) ? data.code : data.error;

		throw new DiscordError(request, response, label, data);
	}

	return response;
}
