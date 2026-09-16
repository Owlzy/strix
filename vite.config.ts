import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import glsl from "vite-plugin-glsl";

export default defineConfig(({ command }) => ({
    root: command === "serve" ? "sample" : undefined,
    build: {
        lib: {
            entry: "src/index.ts",
            name: "Strix",
            fileName: "strix",
            formats: ["es", "umd"],
        },
    },
    plugins: [dts({ include: ["src"] }), glsl()],
}));