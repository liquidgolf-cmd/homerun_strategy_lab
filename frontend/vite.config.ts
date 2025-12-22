import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // In development with Vercel CLI, API routes are handled by Vercel dev server
    // No proxy needed - Vercel dev handles routing
  },
})



