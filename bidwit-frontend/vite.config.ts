import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    nodeResolve({
      preferBuiltins: true
    }),
    commonjs({
      include: /node_modules/,
    }),
    react()
  ],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'react-vendor';
            }
            return 'vendor';
          }
        },
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    target: 'es2015'
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime'
    ],
    esbuildOptions: {
      target: 'es2015'
    }
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true
  },
  preview: {
    port: 3000,
    strictPort: true,
    host: true
  }
}) 