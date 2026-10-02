# 园区政府管理平台（park-gov）

Day 3 把管理端剩余菜单做成可点击的本地台账：风险画像、用地、工作台、园区考核、政策管理、投诉举报、数据报送、统计分析、系统设置。企业名录、用房、闲置仍按 Day 2 的方式保留。态势大屏只加强了玻璃空态，地图、图表和指标舱留到第四日。没有真实接口，也还没有发布 GitHub Pages。

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

顶栏可以退出登录，或把各台账恢复成初始样例。企业、用房、闲置写在 `park-gov.registry.v1`，Day 3 的其余业务台账写在 `park-gov.affairs.v1`。退出登录不会清掉这两份数据。

## 已接通的台账

企业监管里的企业名录，空间监管里的用房和闲置，都有列表、详情和新建/编辑。园区、楼宇、企业样例的字段对齐 `park-shared` 的 `@park/mock`（滨江云栖、临港智造、光谷生命），用房和闲置是政府端扩展。信用代码和电话都是虚构的。

Day 3 用同一套列表、详情、新建/编辑补上其余菜单，样例仍是这三个园区：

| 菜单 | 本地内容 |
| --- | --- |
| 工作台 | 待办、预警、会商，以及跳到名录和监管页的快捷入口 |
| 风险画像 | 企业风险等级、信号和处置状态，详情可进企业档案 |
| 用地 | 规划用途、实际利用和供应进度 |
| 园区考核 | 指标、得分进度和归档 |
| 政策管理 | 文号、适用对象和发布状态 |
| 投诉举报 | 受理、分派和办结 |
| 数据报送 | 周期任务和回执号 |
| 统计分析 | 报表条目和文字摘要，不画图表 |
| 系统设置 | 组织、角色、字典说明，不做真实权限拦截 |

筛选没有结果时给出空态，并可以清空筛选或新建。侧栏选中和路由切换有轻微位移。

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

完整路径例如 `/park-gov/screen/overview`。六个场景都是玻璃空态，标明第四日再接入，不包含地图、图表或指标舱。

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

Vue 3、TypeScript、Vue Router、Pinia、ant-design-vue、Vite。管理端登录和各业务台账都是浏览器本地数据。态势端仍只有场景时钟和玻璃占位。
