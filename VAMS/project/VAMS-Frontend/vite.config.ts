import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:8080'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: BASE_URL + '/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
