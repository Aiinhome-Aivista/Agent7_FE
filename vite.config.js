import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // No proxy needed — Axios calls FastAPI directly at VITE_API_URL
    // CORS is open on the server (allow_origins=["*"])
  }
})

