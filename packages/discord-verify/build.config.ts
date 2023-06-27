import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
	entries: ["./node", "./web", "./aws"],
	rollup: {
		emitCJS: true,
	},
	declaration: true,
});
