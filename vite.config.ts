/// <reference types="vitest" />
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/tests/',
        '**/*.d.ts',
        '**/*.config.{ts,js}',
        'dist/',
      ],
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core vendor chunk - keep small and essential
          vendor: ['react', 'react-dom'],
          
          // Router chunk
          router: ['react-router-dom'],
          
          // Redux chunk
          redux: ['@reduxjs/toolkit', 'react-redux'],
          
          // UI and form libraries
          ui: ['react-hot-toast', 'formik', 'yup'],
          
          // Split AWS into smaller chunks for better caching
          'aws-amplify': ['aws-amplify'],
          'aws-cognito': ['@aws-sdk/client-cognito-identity-provider'],
          
          // Crypto and utilities (split from AWS)
          crypto: ['crypto-js', 'qrcode'],
          utils: ['clsx'],
          
          // Payment related
          payments: ['@stripe/react-stripe-js', '@stripe/stripe-js'],
        },
        // Optimize chunk naming
        chunkFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'vendor') return 'vendor.[hash].js';
          if (chunkInfo.name === 'router') return 'router.[hash].js';
          if (chunkInfo.name === 'redux') return 'redux.[hash].js';
          return 'chunks/[name].[hash].js';
        },
        entryFileNames: 'js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'css/[name].[hash].css';
          }
          return 'assets/[name].[hash][extname]';
        },
      },
      // Enable better tree-shaking for AWS SDK
      treeshake: {
        preset: 'recommended',
        propertyReadSideEffects: false,
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
    ],
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    open: false,
  },
  preview: {
    port: 4173,
    strictPort: true,
    host: true
  }
});
