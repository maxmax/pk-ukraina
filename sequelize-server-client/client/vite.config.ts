import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import eslintPlugin from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd());
  const VITE_BASE = env.VITE_BASE;
  const VITE_OUTPUT = env.VITE_OUTPUT;

  return {
    base: VITE_BASE,
    plugins: [
      react(),
      eslintPlugin()
    ],
    preview: {
      port: 5173,
      strictPort: true,
    },
    server: {
      port: 5173,
      strictPort: true,
      host: true,
      origin: "http://0.0.0.0:5173",
    },
    build: {
      outDir: VITE_OUTPUT, // this line place index.html in the public folder
    },
  }
})
