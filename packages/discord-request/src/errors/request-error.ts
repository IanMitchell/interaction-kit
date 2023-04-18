/**
 * Represents a failed Request. This should not be used for requests that are
 * successful but have a non-200 status code. Those should throw a DiscordError
 * instead.
 */
export class RequestError extends Error {
	/**
	 * The request path
	 */
	path: string;
	/**
	 * The request parameters
	 */
	init: RequestInit;
	/**
	 * The Discord API Server Response
	 */
	response: Response;

	constructor(path: string, init: RequestInit, response: Response) {
		super(`Discord Server Error encountered: ${response.statusText}`);
		this.path = path;
		this.init = init;
		this.response = response;
	}
}
