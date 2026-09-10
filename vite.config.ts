import {defineConfig} from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    build: {
        lib: {
            entry: "src/index.ts",   // your public-API barrel
            name: "Strix",           // global name for the UMD build
            fileName: "strix",
            formats: ["es", "umd"],  // ESM for bundlers, UMD for <script>/CJS
        },
    },
    plugins: [dts({include: ["src"]})],  // emits .d.ts type declarations
});