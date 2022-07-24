type PrimitiveArray = Array<string | number | boolean | null | undefined>;

// TODO: Rename this? Move this somewhere else? Don't love either the name or the `helpers` directory
export function isEqual(
	a: PrimitiveArray | null | undefined,
	b: PrimitiveArray | null | undefined
) {
	return (
		Array.isArray(a) &&
		Array.isArray(b) &&
		a.length === b.length &&
		a.every((val, index) => val === b[index])
	);
}
