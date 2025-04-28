import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // You can change the base path if you're deploying to a subdirectory
  // For example, if deploying to example.com/jsontool/, use base: '/jsontool/'
  // If deploying to the root, keep it as '/'
  base: '/',
  build: {
    // Output directory for production build
    outDir: 'dist',
    // Enable minification for production
    minify: 'terser',
    // Generate source maps for debugging
    sourcemap: false,
    // Configure various build optimizations
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
})
