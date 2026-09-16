import { defineConfig } from "vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const dir = fileURLToPath(new URL(".", import.meta.url)); // the sample/ directory

export default defineConfig({
    root: dir,
    base: "./",
    resolve: {
        alias: {
            // hosted build: consume the real dist bundle, not source
            strix: resolve(dir, "../dist/strix.js"),
        },
    },
    build: {
        outDir: resolve(dir, "../sample-dist"),
        emptyOutDir: true,
        assetsDir: "",
    },
});