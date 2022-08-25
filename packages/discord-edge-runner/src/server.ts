import debug from "debug";
import { EdgeRuntime, runServer } from "edge-runtime";
import esbuild from "esbuild";

const log = debug("discord-edge-runner:server");

function getError(error: unknown): Error {
	if (error instanceof Error) {
		return error;
	}

	if (typeof error === "string" || error === undefined) {
		return new Error(error);
	}

	return new Error(JSON.stringify(error));
}

interface ServerOptions {
	entrypoint: string;
	port?: number;
	env?: Record<string, string>;
	onReload?: () => unknown;
	onError?: (error: unknown) => unknown;
}

export default async function server({
	entrypoint,
	port = 3000,
	env = {},
	onReload,
	onError,
}: ServerOptions) {
	const runtime = new EdgeRuntime({
		extend: (context) =>
			Object.assign(context, {
				process: {
					env: {
						NODE_ENV: "development",
						...env,
					},
				},
			}),
	});

	const server = await runServer({
		runtime,
		port,
	});

	const handler = async (code: string) => {
		try {
			// Temporary workaround: https://github.com/vercel/edge-runtime/issues/20
			runtime.evaluate(`delete self.__listeners['fetch'];`);
			runtime.evaluate(code);
			log("Reloaded server");
			onReload?.();
		} catch (err: unknown) {
			const error = getError(err);
			log(`Error reloading server: ${error.message}`);
			onError?.(error);
		}
	};

	// TODO: Switch to swc
	const compiler = await esbuild.build({
		entryPoints: [entrypoint],
		bundle: true,
		write: false,
		watch: {
			async onRebuild(error, result) {
				if (error) {
					log(`Error compiling application: ${error.message}`);
					onError?.(error);
					return;
				}

				void handler(result?.outputFiles?.[0].text ?? "");
			},
		},
	});

	// Initial Compile
	await handler(compiler.outputFiles[0].text ?? "");

	return {
		async close() {
			await server.close();
			compiler.stop?.();
		},
	};
}
