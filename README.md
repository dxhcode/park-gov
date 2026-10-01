# 园区政府管理平台（park-gov）

Day 2 在 Day 1 脚手架上接入了管理端登录，以及企业名录、空间用房、闲置三条可点击的本地台账。态势大屏仍是场景占位。没有真实接口，也还没有发布 GitHub Pages。

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
pnpm typecheck
```

## 管理端登录

未登录访问管理端会回到登录页。会话写在 `localStorage` 的 `park-gov.session`。三位演示账号密码都是 `Park@2026`：

| 用户名 | 姓名 | 单位与岗位 |
| --- | --- | --- |
| `chenqm` | 陈启明 | 园区管理委员会 · 值班席 |
| `zhoulan` | 周岚 | 经济发展局 · 企业监管专员 |
| `liucheng` | 刘澄 | 规划建设局 · 空间监管专员 |

顶栏可以退出登录，或把企业、用房、闲置恢复成初始样例。台账修改写在 `park-gov.registry.v1`，退出登录不会清掉。

## 已接通的台账

企业监管里的企业名录，空间监管里的用房和闲置，都有列表、详情和新建/编辑。园区、楼宇、企业样例的字段对齐 `park-shared` 的 `@park/mock`（滨江云栖、临港智造、光谷生命），用房和闲置是政府端扩展。信用代码和电话都是虚构的。

风险画像、用地，以及工作台、考核、政策、投诉、报送、统计、设置，仍是占位页。

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

Vue 3、TypeScript、Vue Router、Pinia、ant-design-vue、Vite。管理端登录和企业、用房、闲置台账都是浏览器本地数据；态势端仍只有场景时钟。
