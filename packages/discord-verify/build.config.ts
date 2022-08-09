import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
	entries: ["./node", "./web"],
	rollup: {
		emitCJS: true,
	},
	declaration: true,
});
