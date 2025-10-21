import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['social.nexvisionlab.com'],
    host: '0.0.0.0',
    port: 4200,
    proxy: {
      '/api': {
        target: process.env.API_URL, // <- from .env
        changeOrigin: true,
      },
    },
  }
})
