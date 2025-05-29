import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        },
        manualChunks: {
          vendor: ['chart.js', 'react-chartjs-2', 'react-window', 'react-virtualized-auto-sizer', 'react-icons'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
    target: 'es2015'
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'chart.js', 
      'react-chartjs-2', 
      'react-window', 
      'react-virtualized-auto-sizer'
    ],
    esbuildOptions: {
      target: 'es2015'
    }
  },
}) 