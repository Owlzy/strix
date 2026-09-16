import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import dts from "vite-plugin-dts";
import glsl from "vite-plugin-glsl";

export default defineConfig(({ command }) => ({
    root: command === "serve" ? "sample" : undefined,
    resolve: {
        alias: {
            // dev: consume engine source directly, so editing it hot-reloads the sample
            strix: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
        },
    },
    build: {
        lib: { entry: "src/index.ts", name: "Strix", fileName: "strix", formats: ["es", "umd"] },
    },
    plugins: [dts({ include: ["src"] }), glsl()],
}));