import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Backend the dev server proxies to. Override with API_PROXY_TARGET if port 5000 is taken.
const apiTarget = process.env.API_PROXY_TARGET || 'http://localhost:5000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 6001,
    host: true,
    proxy: {
      '/api': apiTarget,
      '/uploads': apiTarget,
    }
  },
})
