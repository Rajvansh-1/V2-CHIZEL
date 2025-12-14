import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@router': path.resolve(__dirname, './src/router'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Group heavy dependencies into a separate chunk
          vendor: ['react', 'react-dom', 'gsap', 'react-router-dom'],
        },
        // Ensure consistent asset naming for production
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    // Ensure proper CSS extraction
    cssCodeSplit: true,
    // Source maps for debugging (optional, can disable for production)
    sourcemap: false,
  },
  // Base path for deployment
  base: './',
})