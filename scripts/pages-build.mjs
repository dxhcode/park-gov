import { execFileSync } from 'node:child_process'
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')

rmSync(dist, { recursive: true, force: true })
mkdirSync(dist, { recursive: true })

execFileSync('pnpm', ['--filter', 'admin-app', 'build'], { cwd: root, stdio: 'inherit' })
execFileSync('pnpm', ['--filter', 'screen-app', 'build'], { cwd: root, stdio: 'inherit' })

cpSync(resolve(root, 'apps/admin-app/dist'), resolve(dist, 'admin'), { recursive: true })
cpSync(resolve(root, 'apps/screen-app/dist'), resolve(dist, 'screen'), { recursive: true })
cpSync(resolve(dist, 'admin/index.html'), resolve(dist, 'admin/404.html'))
cpSync(resolve(dist, 'screen/index.html'), resolve(dist, 'screen/404.html'))

const portal = readFileSync(resolve(root, 'scripts/pages-portal.html'), 'utf8')
writeFileSync(resolve(dist, 'index.html'), portal)
writeFileSync(resolve(dist, '.nojekyll'), '')
writeFileSync(
  resolve(dist, '404.html'),
  `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <title>正在返回园区政府管理平台</title>
    <script>
      (function () {
        var parts = location.pathname.split('/').filter(Boolean)
        var mark = parts.indexOf('park-gov')
        var prefixParts = mark >= 0 ? parts.slice(0, mark + 1) : []
        var after = mark >= 0 ? parts.slice(mark + 1) : parts
        var app = after[0] === 'screen' ? 'screen' : 'admin'
        var rest = after[0] === 'admin' || after[0] === 'screen' ? after.slice(1) : after
        var prefix = prefixParts.length ? '/' + prefixParts.join('/') : ''
        var target = prefix + '/' + app + '/'
        if (rest.length) {
          target += '?p=/' + rest.map(encodeURIComponent).join('/')
        }
        location.replace(target + location.hash)
      })()
    </script>
  </head>
  <body>正在返回园区政府管理平台…</body>
</html>
`,
)

console.log('')
console.log('Pages 产物已生成：')
console.log('  dist/index.html')
console.log('  dist/admin/')
console.log('  dist/screen/')
console.log('  dist/404.html')
console.log('  dist/.nojekyll')
