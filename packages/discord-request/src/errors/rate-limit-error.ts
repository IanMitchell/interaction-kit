/**
 * Represents a request to a rate limited resource. This generally corresponds
 * to a 429 status code on a certain route with a major parameter, not the
 * global rate limit. To learn more about rate limits, see the Discord
 * Developer Documentation
 * @see {@link https://discord.com/developers/docs/topics/rate-limits#rate-limits}
 */
export class RateLimitError extends Error {
	/**
	 * The Discord API response
	 */
	response: Response;
	/**
	 * Total time in seconds to wait before retrying the request. This is
	 * independent between top level resources.
	 */
	retryAfter: number;

	constructor(response: Response) {
		super("Your bot is currently rate limited");
		this.response = response;
		this.retryAfter = parseFloat(response.headers.get("Retry-After") ?? "0");
	}
}
