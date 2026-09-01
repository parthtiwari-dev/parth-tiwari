/** Serve the standalone Phase 4 comparison without adding a production Astro route. */

import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const portArgument = process.argv.find((argument) => argument.startsWith('--port='))
const port = Number(portArgument?.split('=')[1] ?? 4326)
const contentTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.jpg', 'image/jpeg'],
  ['.png', 'image/png'],
  ['.woff2', 'font/woff2'],
])

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://127.0.0.1:${port}`)
    const requestedPath = decodeURIComponent(url.pathname)
    const requested = requestedPath === '/'
      ? '/design/directions/phase-4-paper-transition.html'
      : requestedPath.endsWith('/')
        ? `/dist${requestedPath}index.html`
        : requestedPath
    const resolved = path.resolve(root, `.${requested}`)
    if (!resolved.startsWith(root)) throw new Error('Path escapes the workspace root.')
    const bytes = await readFile(resolved)
    response.writeHead(200, {
      'cache-control': 'no-store',
      'content-type': contentTypes.get(path.extname(resolved)) ?? 'application/octet-stream',
    })
    response.end(bytes)
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
    response.end('Not found')
  }
})

server.listen(port, '127.0.0.1', () => {
  console.log(`Phase 4 motion study: http://127.0.0.1:${port}/`)
})
