// vite.config.mts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// __dirname em ESM:
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, 'client')

export default defineConfig(async ({ command, mode }) => {
  const isDevServer = command === 'serve'
  const isProd = mode === 'production'

  const plugins = [react()]

  // Ativa os plugins do Replit somente no dev server.
  if (isDevServer) {
    const { default: runtimeErrorOverlay } = await import('@replit/vite-plugin-runtime-error-modal')
    plugins.push(runtimeErrorOverlay())

    if (!isProd && process.env.REPL_ID) {
      const { cartographer } = await import('@replit/vite-plugin-cartographer')
      plugins.push(cartographer())
    }
  }

  return {
    base: isProd ? '/abmix-ligacao/' : '/',
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(rootDir, 'src'),
        '@shared': path.resolve(__dirname, 'shared'),
        '@assets': path.resolve(__dirname, 'attached_assets'),
      },
    },
    root: rootDir,
    build: {
      // gera para a pasta dist na raiz do projeto
      outDir: path.resolve(__dirname, 'dist'),
      emptyOutDir: false, // mantém o index do servidor
      assetsDir: 'assets',
    },
    server: {
      fs: { strict: true, deny: ['**/.*'] },
    },
  }
})
