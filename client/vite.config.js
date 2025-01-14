import path from "path";
import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import react from "@vitejs/plugin-react";
import topLevelAwait from "vite-plugin-top-level-await";
import mkcert from "vite-plugin-mkcert"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), wasm(), topLevelAwait(), mkcert()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});