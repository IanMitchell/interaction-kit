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
	/**
	 * The entrypoint path for the application.
	 */
	entrypoint: string;

	/**
	 * The port the Edge Runtime VM should listen on.
	 */
	port?: number;

	/**
	 * Environmental Variables to pass to the Edge Runtime VM. Automatically sets `ENV` to Development.
	 */
	env?: Record<string, string>;

	/**
	 *  A callback to run when the application is reloaded.
	 */
	onReload?: () => unknown;

	/**
	 * A callback to run when the application errors.
	 */
	onError?: (error: unknown) => unknown;
}

/**
 * Compiles and builds an application to then run in an Edge Runtime VM.
 * @param options - Options to create the Edge Runtime VM with.
 * @returns A server handle to shut down the server.
 */
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
