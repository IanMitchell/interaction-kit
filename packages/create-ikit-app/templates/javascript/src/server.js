import * as dotenv from "dotenv";
import Fastify from "fastify";
import Application from "./app";

dotenv.config();

const app = Fastify({
	logger: true,
});

const server = await Application.startServer();
app.register(server);

export default async (request, response) => {
	await app.ready();
	app.server.emit("request", request, response);
};
