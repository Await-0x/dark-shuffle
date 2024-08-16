import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import topLevelAwait from "vite-plugin-top-level-await";
import mkcert from "vite-plugin-mkcert"

export default defineConfig({
  plugins: [mkcert(), react(), topLevelAwait()],
})
