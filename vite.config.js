import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window',  // Define 'global' como 'window' para compatibilidad en el navegador
  },
  server: {
    hmr: {
      overlay: false,  // Disable the error overlay
    },
  },
});