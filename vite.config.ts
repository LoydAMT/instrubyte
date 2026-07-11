import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

// Vite's dev server doesn't check public/ for a nested index.html when a URL ends in
// "/" (only exact file matches) — it just falls back to the app's root index.html.
// This project has real standalone pages there (contact, privacy-policy, terms-of-service),
// so this rewrites those requests to the actual file before Vite's SPA fallback runs.
// `vite build` + `vite preview` (and real static hosts) already resolve this correctly on
// their own — this plugin only affects `vite dev`.
function publicDirIndexFallback(): Plugin {
  return {
    name: 'public-dir-index-fallback',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (!req.url) return next()
        const [urlPath, query = ''] = req.url.split('?')
        if (urlPath === '/' || urlPath.includes('.')) return next()

        const dirPath = urlPath.endsWith('/') ? urlPath : `${urlPath}/`
        const candidate = path.join(server.config.publicDir, dirPath, 'index.html')
        if (fs.existsSync(candidate)) {
          req.url = `${dirPath}index.html${query ? `?${query}` : ''}`
        }
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [publicDirIndexFallback(), react()],
})
