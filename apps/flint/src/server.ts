import Application from "./app.js";

addEventListener("fetch", (event) => {
	event.respondWith(
		Application.handler(event.request).catch((error: unknown) => {
			console.error({ error });
			return new Response("internal error", { status: 500 });
		})
	);
});
