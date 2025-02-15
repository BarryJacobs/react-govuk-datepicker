/// <reference types="vitest" />

import { resolve } from "node:path"
import { defineConfig } from "vite"
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js"
import react from "@vitejs/plugin-react"
import dts from "vite-plugin-dts"
import tsConfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [
    react(),
    tsConfigPaths(),
    cssInjectedByJsPlugin(),
    dts({
      include: ["lib"]
    })
  ],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      name: "ReactGovukDatepicker",
      fileName: format => `react-govuk-datepicker.${format}.js`,
      formats: ["es", "umd"]
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime"
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern"
      }
    }
  },
  test: {
    setupFiles: ["./setupTests.ts"],
    globals: true,
    environment: "jsdom",
    css: true,
    environmentOptions: {
      jsdom: {
        resources: "usable"
      }
    }
  }
})
