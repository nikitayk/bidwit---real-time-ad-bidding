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
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV === 'development',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chart-vendor': ['chart.js', 'react-chartjs-2'],
          'ui-vendor': ['@headlessui/react', '@heroicons/react', 'react-icons'],
          'data-vendor': ['zustand', 'react-table', 'react-virtualized', 'react-window'],
          'form-vendor': ['react-datepicker', 'react-dropzone', 'react-toastify']
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
    target: 'esnext',
    assetsDir: 'assets',
    emptyOutDir: true,
    cssCodeSplit: true,
    modulePreload: true,
    reportCompressedSize: false,
    cssMinify: true,
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      'chart.js', 
      'react-chartjs-2',
      'react-icons',
      'zustand',
      'react-table',
      'react-virtualized',
      'react-window',
      'react-datepicker',
      'react-dropzone',
      'react-toastify'
    ],
  },
  preview: {
    port: 3000,
  },
})
