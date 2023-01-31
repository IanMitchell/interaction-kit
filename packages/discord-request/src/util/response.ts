export async function parse<T>(response: Response) {
	if (response.headers.get("Content-Type") === "application/json") {
		return response.json<T>();
	}

	return response.arrayBuffer();
}
