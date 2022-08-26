export const OFFSET = 50;

export const ONE_SECOND = 1000;
export const ONE_MINUTE = 60 * ONE_SECOND;
export const ONE_HOUR = 60 * ONE_MINUTE;
export const ONE_DAY = 24 * ONE_HOUR;

export async function sleep(
	timeout: number,
	signal?: AbortSignal | null
): Promise<void> {
	console.log("zzz");
	return new Promise((resolve, reject) => {
		console.log("timeout setup");
		// Create the sleep loop
		const ref = setTimeout(() => {
			cleanup();
			resolve();
		}, timeout);

		// Handle shutdown signals
		const cleanup = () => {
			clearTimeout(ref);
			signal?.removeEventListener("abort", shutdown);
		};

		const shutdown = () => {
			cleanup();
			reject(new Error("aborted"));
		};

		signal?.addEventListener("abort", shutdown);
	});
}
