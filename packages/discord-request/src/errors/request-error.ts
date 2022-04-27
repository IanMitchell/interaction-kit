export class RequestError extends Error {
	resource: string;
	init: RequestInit;
	response: Response;

	constructor(
		resource: string,
		init: RequestInit,
		response: Response,
		message: string
	) {
		super(message);
		this.resource = resource;
		this.init = init;
		this.response = response;
	}
}
