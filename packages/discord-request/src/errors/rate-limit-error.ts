/**
 * TODO: Document
 */
export class RateLimitError extends Error {
	response: Response;
	retryAfter: number;

	constructor(message: string, response: Response) {
		super(message);
		this.response = response;
		this.retryAfter = parseFloat(response.headers.get("Retry-After") ?? "0");
	}
}
