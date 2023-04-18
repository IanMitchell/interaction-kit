/**
 * TODO: Document
 */
export class RateLimitError extends Error {
	response: Response;
	retryAfter: number;

	constructor(response: Response) {
		super("Your bot is currently rate limited");
		this.response = response;
		this.retryAfter = parseFloat(response.headers.get("Retry-After") ?? "0");
	}
}
