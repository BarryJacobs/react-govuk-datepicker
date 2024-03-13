/// <reference types="vitest" />

import { resolve } from "node:path"
import { defineConfig } from "vite"
import { libInjectCss } from "vite-plugin-lib-inject-css"
import react from "@vitejs/plugin-react"
import dts from "vite-plugin-dts"
import tsConfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [
    react(),
    tsConfigPaths(),
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
