import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/routes/index.ts", "src/sanity/index.ts"],
  format: ["cjs", "esm"], // Build for commonJS and ESmodules
  dts: true, // Generate declaration file (.d.ts)
  splitting: true,
  sourcemap: true,
  clean: true,
})
