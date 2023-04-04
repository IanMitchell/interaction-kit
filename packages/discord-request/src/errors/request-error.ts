/**
 * Represents a failed Request. This should not be used for requests that are
 * successful but have a non-200 status code. Those should throw a DiscordError
 * instead.
 */
export class RequestError extends Error {
	path: string;
	init: RequestInit;
	response: Response;

	constructor(
		path: string,
		init: RequestInit,
		response: Response,
		message: string
	) {
		super(message);
		this.path = path;
		this.init = init;
		this.response = response;
	}
}
