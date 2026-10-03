import { createReadStream, existsSync, statSync } from 'node:fs'
import http from 'node:http'
import { extname, join, resolve, dirname, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const port = Number(process.env.PORT || 4173)
const prefix = '/park-gov'

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
}

if (!existsSync(join(root, 'index.html'))) {
  console.error('未找到 dist/index.html，请先执行 pnpm pages:build')
  process.exit(1)
}

function resolveFile(urlPath) {
  const rel = decodeURIComponent(urlPath).replace(/^\/+/, '')
  const file = join(root, rel)
  const rootWithSep = root.endsWith(sep) ? root : root + sep
  if (file !== root && !file.startsWith(rootWithSep)) return null
  return file
}

function send(res, file) {
  res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' })
  createReadStream(file).pipe(res)
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', 'http://127.0.0.1')
  if (url.pathname === '/') {
    res.writeHead(302, { Location: `${prefix}/` })
    res.end()
    return
  }
  if (url.pathname !== prefix && !url.pathname.startsWith(`${prefix}/`)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('not found')
    return
  }

  let rel = url.pathname.slice(prefix.length) || '/'
  if (rel.endsWith('/')) rel += 'index.html'
  let file = resolveFile(rel)
  if (file && existsSync(file) && statSync(file).isFile()) {
    send(res, file)
    return
  }

  const fallback = rel.startsWith('/screen')
    ? resolveFile('/screen/index.html')
    : rel.startsWith('/admin')
      ? resolveFile('/admin/index.html')
      : resolveFile('/index.html')
  if (!fallback || !existsSync(fallback)) {
    res.writeHead(404)
    res.end('missing fallback')
    return
  }
  send(res, fallback)
})

server.listen(port, '0.0.0.0', () => {
  console.log(`Pages 预览：http://127.0.0.1:${port}${prefix}/`)
})
