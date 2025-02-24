import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@layouts': '/src/layouts',
      '@assets': '/src/assets',
    },
  },
  css: {
    preprocessorOptions: {
      // No additional config needed for plain CSS, but you can add PostCSS/Tailwind-specific options here
    },
  },
})
