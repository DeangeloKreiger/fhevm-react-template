import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  // Use environment variable for base path
  // Default to '/' for Vercel and local dev
  // GitHub Pages CI sets VITE_BASE_PATH to '/PropertyTrading/'
  base: process.env.VITE_BASE_PATH || '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
    rollupOptions: {
      output: {
        // Remove manual chunks to avoid circular dependency issues
        manualChunks: undefined
      }
    }
  },
  esbuild: {
    target: 'es2020'
  },
  optimizeDeps: {
    include: ['viem', '@wagmi/core', '@wagmi/connectors']
  },
  server: {
    port: 1291,
    open: true,
    host: true  // Allow network access
  }
})
