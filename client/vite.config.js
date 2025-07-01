import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve('./src'),
    },
  },build: {
    outDir: 'dist',
    target: 'chrome105', // or latest Electron-compatible target
  },
  server: {
    port: 5173,
  },
});
