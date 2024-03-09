import { resolve } from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import dts from "vite-plugin-dts"
import EsLint from "vite-plugin-linter"
import tsConfigPaths from "vite-tsconfig-paths"
import * as packageJson from "./package.json"

const { EsLinter, linterPlugin } = EsLint

export default defineConfig(configEnv => ({
  plugins: [
    react(),
    tsConfigPaths(),
    linterPlugin({
      include: ["./src}/**/*.{ts,tsx}"],
      linters: [new EsLinter({ configEnv })]
    }),
    dts({
      include: ["src/components/"]
    })
  ],
  build: {
    lib: {
      entry: resolve("src", "components/index.ts"),
      name: "ReactGovUKDatePicker",
      formats: ["es", "umd"],
      fileName: format => `react-govuk-datepicker.${format}.js`
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies)]
    }
  }
}))
