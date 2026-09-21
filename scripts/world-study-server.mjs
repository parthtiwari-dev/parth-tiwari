/** Local-only storyboard review. No study enters Astro's public route set. */
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const mime = new Map([['.html', 'text/html; charset=utf-8'], ['.css', 'text/css'], ['.js', 'text/javascript'], ['.svg', 'image/svg+xml'], ['.png', 'image/png'], ['.jpg', 'image/jpeg'], ['.webp', 'image/webp'], ['.woff2', 'font/woff2']])
export function createStudyServer(root = process.cwd()) {
  return createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
      if (pathname.includes('\\') || pathname.split('/').includes('..')) throw new Error('Invalid review path')
      if (pathname === '/') {
        response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end(`<!doctype html><html lang="en"><meta name="viewport" content="width=device-width"><title>World storyboard review</title><body style="background:#08090a;color:#f4f4ef;font:20px/1.6 sans-serif;padding:5vw"><h1>Animated world studies</h1><p>MedRAG and SecondSelf now have original generated environments and interactive stories. These are local studies, not published routes.</p><ul><li><a style="color:#8de4cb" href="/design/directions/medrag-world.html">MedRAG · The Theatre of an Answer</a></li><li><a style="color:#dfbb7c" href="/design/directions/order-supervisor-world.html">Order Supervisor · Inside the Night Watch</a></li><li><a style="color:#e7bd8a" href="/design/directions/secondself-world.html">SecondSelf · A Little Further, Together</a></li><li><a style="color:#edcb85" href="/design/directions/querypilot-world.html">QueryPilot · The Cartographer’s Fold</a></li></ul><p><a style="color:#ddd" href="/work/tathya/world/">Review Tathya closeout</a> · <a style="color:#ddd" href="/work/vivid/world/">Review Vivid</a></p></body></html>`)
        return
      }
      const relative = pathname.startsWith('/design/directions/') ? pathname.slice(1)
        : pathname.startsWith('/public/fonts/') ? pathname.slice(1)
        : /^\/(fonts|media)\//.test(pathname) ? `public${pathname}`
        : /^\/(work\/|_astro\/)/.test(pathname) ? `dist${pathname}${pathname.endsWith('/') ? 'index.html' : ''}`
        : undefined
      if (!relative) throw new Error('Not a review resource')
      const filename = path.resolve(root, relative)
      const inside = path.relative(root, filename)
      if (inside.startsWith('..') || path.isAbsolute(inside)) throw new Error('Outside review root')
      response.writeHead(200, { 'content-type': mime.get(path.extname(filename)) ?? 'application/octet-stream', 'cache-control': 'no-store' }).end(await readFile(filename))
    } catch { response.writeHead(404, { 'content-type': 'text/plain' }).end('Not found') }
  })
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const server = createStudyServer()
  const port = Number(process.argv.find((arg) => arg.startsWith('--port='))?.split('=')[1] ?? 4327)
  server.listen(port, '127.0.0.1', () => console.log(`World studies: http://127.0.0.1:${server.address().port}/`))
}
