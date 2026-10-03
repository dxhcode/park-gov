import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function git(args, cwd = root) {
  execFileSync('git', args, { cwd, stdio: 'inherit' })
}

function gitOut(args, cwd = root) {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim()
}

function printHelp() {
  console.log(`尚未推送。要发布请设置 PAGES_PUBLISH=1。仓库 Pages 需自行选 dist 分支根目录。

构建产物：
  pnpm pages:build
  生成 dist/index.html、dist/admin/、dist/screen/、dist/404.html、dist/.nojekyll

推送到 dist 分支（站点根目录即 dist 内容）：
  PAGES_PUBLISH=1 pnpm pages:publish

等价手工步骤：
  1. pnpm pages:build
  2. 将 dist/ 目录中的文件放到 orphan 分支 dist 的根目录
  3. git push origin dist
  4. 仓库 Settings → Pages → Build and deployment → Deploy from a branch
     Branch: dist  Folder: / (root)

项目页地址形态：
  https://<owner>.github.io/park-gov/
  https://<owner>.github.io/park-gov/admin/
  https://<owner>.github.io/park-gov/screen/
`)
}

function remoteHasDist() {
  const listed = gitOut(['ls-remote', '--heads', 'origin', 'dist'])
  return listed.includes('refs/heads/dist')
}

function emptyWorktree(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry === '.git') continue
    rmSync(join(dir, entry), { recursive: true, force: true })
  }
}

function commitAndPush(dir) {
  git(['add', '-A'], dir)
  const status = gitOut(['status', '--porcelain'], dir)
  if (!status) {
    console.log('dist 分支内容没有变化，跳过提交。')
    return
  }
  git(['commit', '-m', 'chore: 发布园区政府管理平台 Pages 静态产物'], dir)
  git(['push', 'origin', 'HEAD:dist'], dir)
  console.log('已推送到 origin/dist。Pages 需在仓库设置中选择 dist 分支根目录后才会上线。')
}

if (process.env.PAGES_PUBLISH !== '1') {
  printHelp()
  process.exit(0)
}

execFileSync('pnpm', ['pages:build'], { cwd: root, stdio: 'inherit' })

const source = resolve(root, 'dist')
const work = join(tmpdir(), `park-gov-pages-${Date.now()}`)
mkdirSync(work, { recursive: true })
let tempBranch = ''

try {
  if (remoteHasDist()) {
    git(['fetch', 'origin', 'dist'])
    git(['worktree', 'add', '--detach', work, 'origin/dist'])
  } else {
    tempBranch = 'pages-publish-tmp'
    git(['worktree', 'add', '--detach', work, 'HEAD'])
    git(['checkout', '--orphan', tempBranch], work)
  }
  git(['read-tree', '--empty'], work)
  emptyWorktree(work)

  for (const entry of readdirSync(source)) {
    cpSync(join(source, entry), join(work, entry), { recursive: true })
  }
  commitAndPush(work)
} finally {
  if (existsSync(work)) {
    try {
      git(['worktree', 'remove', '--force', work])
    } catch {
      rmSync(work, { recursive: true, force: true })
    }
  }
  if (tempBranch) {
    try {
      git(['branch', '-D', tempBranch])
    } catch {
      // 分支可能尚未创建
    }
  }
}
