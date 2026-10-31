import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    // The preview host is a dynamic sandbox domain; allowing it keeps the
    // live preview working inside the preview iframe.
    allowedHosts: true,
    // HMR is intentionally left at its default: the client derives host,
    // protocol (ws/wss) and port from `location`, so it works both on
    // localhost and behind the https preview proxy.
    watch: {
      ignored: ['**/*.tsbuildinfo', '**/dist/**', '**/.tmp/**', '**/.verify*/**'],
    },
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
