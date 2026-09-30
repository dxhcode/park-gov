# 园区政府管理平台（park-gov）

Day 1 前端脚手架：pnpm monorepo 里的两个 Vue 应用。管理端是带深色侧栏的政务工作台，态势端是暗色科技大屏。菜单和路由已经铺满，页面内容是占位，没有登录、接口、图表或地图。

## 目录

```text
apps/admin-app     管理端，Vite base /park-gov/admin/
apps/screen-app    态势大屏，Vite base /park-gov/screen/
scripts/           Pages 门户、构建、预览、发布
```

## 本地开发

```bash
pnpm install
pnpm dev:admin     # http://localhost:5173/park-gov/admin/
pnpm dev:screen    # http://localhost:5174/park-gov/screen/
pnpm build         # 分别构建两个应用
```

## 管理端菜单

| 菜单 | 路由 |
| --- | --- |
| 工作台 | `/workbench` |
| 企业监管 / 企业名录 | `/enterprise/directory` |
| 企业监管 / 风险画像 | `/enterprise/risk` |
| 空间监管 / 用地 | `/space/land` |
| 空间监管 / 用房 | `/space/building` |
| 空间监管 / 闲置 | `/space/idle` |
| 园区考核 | `/assessment` |
| 政策管理 | `/policy` |
| 投诉举报 | `/complaint` |
| 数据报送 | `/submission` |
| 统计分析 | `/analytics` |
| 系统设置 | `/settings` |

浏览器里的完整路径要加上 base，例如 `/park-gov/admin/workbench`。

## 态势大屏场景

| 场景 | 路由 |
| --- | --- |
| 监管总览 | `/overview` |
| 空间态势 | `/space` |
| 企业风险 | `/enterprise-risk` |
| 考核看板 | `/assessment` |
| 投诉热力 | `/complaint-heat` |
| 告警中心 | `/alerts` |

完整路径例如 `/park-gov/screen/overview`。

## GitHub Pages

`pnpm pages:build` 会先构建两个应用，再汇总到仓库根目录 `dist/`：

```text
dist/index.html     入口，链到管理端和大屏
dist/admin/         管理端静态产物
dist/screen/        态势大屏静态产物
dist/404.html       深链刷新时回到对应应用
dist/.nojekyll
```

本地按项目页路径预览：

```bash
pnpm pages:preview
# http://127.0.0.1:4173/park-gov/
```

发布脚本只负责把上述产物推到 `dist` 分支，不会替你打开 Pages。Day 4 再启用：

```bash
PAGES_PUBLISH=1 pnpm pages:publish
```

不带环境变量时，`pnpm pages:publish` 只打印步骤并退出。手工推送也可以：

1. `pnpm pages:build`
2. 把 `dist/` 里的文件放到 `dist` 分支根目录并提交
3. `git push origin dist`
4. 仓库 Settings → Pages → Deploy from a branch → Branch 选 `dist`，Folder 选 `/ (root)`

上线后的地址形态：

- `https://<owner>.github.io/park-gov/`
- `https://<owner>.github.io/park-gov/admin/`
- `https://<owner>.github.io/park-gov/screen/`

两个应用的 Vite `base` 已经按这个项目页路径写好。应用内用 Vue Router 跳转；直接打开深层地址时，根目录 `404.html` 会带回 `?p=` ，入口脚本再还原路径。

## 技术栈

Vue 3、TypeScript、Vue Router、Pinia、ant-design-vue、Vite。状态只放了侧栏折叠和态势时钟，没有业务数据。
