import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["./node.ts", "./web.ts"],
	sourcemap: true,
	dts: true,
});
