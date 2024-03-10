import { resolve } from "node:path"
import { defineConfig } from "vite"
import { libInjectCss } from "vite-plugin-lib-inject-css"
import { EsLinter, linterPlugin } from "vite-plugin-linter"
import react from "@vitejs/plugin-react"
import dts from "vite-plugin-dts"
import tsConfigPaths from "vite-tsconfig-paths"

export default defineConfig(configEnv => ({
  plugins: [
    react(),
    tsConfigPaths(),
    linterPlugin({
      include: ["./src}/**/*.{ts,tsx}"],
      linters: [new EsLinter({ configEnv })]
    }),
    libInjectCss(),
    dts({
      include: ["lib"]
    })
  ],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      formats: ["es"]
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime"]
    }
  }
}))
