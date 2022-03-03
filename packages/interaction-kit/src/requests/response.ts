export enum ResponseStatus {
	OK = 200,
	BadRequest = 400,
}

export function response(status: ResponseStatus, json: Record<string, any>) {
	return new Response(JSON.stringify(json), { status });
}
