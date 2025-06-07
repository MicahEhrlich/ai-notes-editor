import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    plugins: [react({
      babel: {
        plugins: isDev ? ['babel-plugin-add-react-displayname'] : []
      }
    }), tailwindcss()],
    build: { outDir: 'dist' },
    server: { port: 5173 },
    base: '/',
  }
});
