export const OFFSET = 50;

export const ONE_SECOND = 1000;
export const ONE_MINUTE = 60 * ONE_SECOND;
export const ONE_HOUR = 60 * ONE_MINUTE;
export const ONE_DAY = 24 * ONE_HOUR;

export async function sleep(
	timeout: number,
	abort?: AbortSignal | null
): Promise<void> {
	return new Promise((resolve) => {
		const ref = setTimeout(() => {
			cleanup();
			resolve();
		}, timeout);

		const cleanup = () => {
			clearTimeout(ref);
		};

		abort?.addEventListener("signal", () => {
			cleanup();
		});
	});
}
