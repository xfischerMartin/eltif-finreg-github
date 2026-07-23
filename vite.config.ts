import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const functionKey = env.AZURE_FUNCTION_KEY

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // Local testing only: inject function key server-side (not in browser bundle).
      proxy: {
        '/api/create_pdf': {
          target: 'https://fn-eltif-create-pdf.azurewebsites.net',
          changeOrigin: true,
          secure: true,
          headers: functionKey
            ? { 'x-functions-key': functionKey }
            : undefined,
        },
      },
    },
    test: {
      environment: 'node',
    },
  }
})
