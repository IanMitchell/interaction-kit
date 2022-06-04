export async function parse<T>(response: Response) {
	if (response.headers.get("content-type") === "application/json") {
		return response.json<T>();
	}

	return response.arrayBuffer();
}
