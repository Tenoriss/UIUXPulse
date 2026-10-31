import { build } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));

await build({
  root,
  configFile: false,
  logLevel: 'error',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.join(root, 'src') } },
  ssr: {
    noExternal: true,
    external: ['node:zlib', 'zlib', 'node:fs', 'fs', 'node:path', 'path', 'node:module', 'module'],
  },
  build: {
    ssr: process.argv[2],
    outDir: '.verify/out',
    emptyOutDir: true,
    minify: false,
    rollupOptions: { output: { format: 'iife', entryFileNames: 'app.js' } },
  },
});
