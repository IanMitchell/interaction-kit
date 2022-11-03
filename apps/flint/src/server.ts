import Application from "./app.js";

addEventListener("fetch", (event) => {
	event.respondWith(
		Application.handler(event.request).catch((error) => {
			console.log({ error });
			return new Response("internal error", { status: 500 });
		})
	);
});
