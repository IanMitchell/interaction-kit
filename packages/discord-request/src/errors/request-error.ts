// import type { InternalRequest } from "../RequestManager";
// import { RequestMethod } from "../types";
// import type { RequestBody } from "./DiscordAPIError";

import type { RequestData, RequestMethod } from "../types";

export class RequestError extends Error {
	name: string;
	url: string;
	method: RequestMethod;
	status: number;
	data: RequestData["files"] & { json: Record<string, unknown> };

	constructor(
		name: string,
		message: string,
		url: string,
		method: RequestMethod,
		status: number,
		body: Pick<RequestData, "files" | "body">
	) {
		super(message);

		this.name = name;
		this.url = url;
		this.method = method;
		this.status = status;
		this.data = {
			files: body.files,
			json: body.body as Record<string, unknown>,
		};
	}
}
