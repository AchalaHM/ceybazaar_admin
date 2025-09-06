import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // change to desired port
  },
  base: process.env.VITE_BASE_PATH || "/", // replace with your context root
})
