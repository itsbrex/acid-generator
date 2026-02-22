import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env,
  },
  assetsInclude: ['**/*.md'],
  plugins: [react(), eslint({ fix: true })],
  base: '',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          audio: ['tone', '@tonejs/midi'],
          vendor: ['react', 'react-dom', 'react-redux', '@reduxjs/toolkit'],
          music: ['tonal'],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
});
