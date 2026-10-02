import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { menus, type MenuNode } from '../config/menus'
import AdminLayout from '../layouts/AdminLayout.vue'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import { ledgerModules } from '../ledger/modules'
import PlaceholderView from '../views/PlaceholderView.vue'
import LedgerDetailView from '../views/ledger/LedgerDetailView.vue'
import LedgerFormView from '../views/ledger/LedgerFormView.vue'
import LedgerListView from '../views/ledger/LedgerListView.vue'
import EnterpriseDetailView from '../views/enterprise/EnterpriseDetailView.vue'
import EnterpriseFormView from '../views/enterprise/EnterpriseFormView.vue'
import EnterpriseListView from '../views/enterprise/EnterpriseListView.vue'
import IdleDetailView from '../views/space/IdleDetailView.vue'
import IdleFormView from '../views/space/IdleFormView.vue'
import IdleListView from '../views/space/IdleListView.vue'
import RoomDetailView from '../views/space/RoomDetailView.vue'
import RoomFormView from '../views/space/RoomFormView.vue'
import RoomListView from '../views/space/RoomListView.vue'

const livePaths = new Set(['/enterprise/directory', '/space/building', '/space/idle'])
const ledgerKeys = new Set(ledgerModules.map((item) => item.key))

function leafRoutes(nodes: MenuNode[], group?: string): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = []
  for (const node of nodes) {
    if (node.children?.length) {
      routes.push(...leafRoutes(node.children, node.title))
      continue
    }
    if (!node.path || livePaths.has(node.path) || ledgerKeys.has(node.key)) continue
    routes.push({
      path: node.path.replace(/^\//, ''),
      name: node.key,
      component: PlaceholderView,
      meta: {
        title: node.title,
        group: group ?? node.title,
        hint: node.hint ?? '',
        slots: node.slots ?? [],
        menuKey: node.key,
      },
    })
  }
  return routes
}

const registryRoutes: RouteRecordRaw[] = [
  {
    path: 'enterprise/directory',
    name: 'enterprise-directory',
    component: EnterpriseListView,
    meta: { title: '企业名录', group: '企业监管', menuKey: 'enterprise-directory' },
  },
  {
    path: 'enterprise/directory/new',
    name: 'enterprise-directory-create',
    component: EnterpriseFormView,
    meta: { title: '新建企业', group: '企业监管', menuKey: 'enterprise-directory' },
  },
  {
    path: 'enterprise/directory/:id',
    name: 'enterprise-directory-detail',
    component: EnterpriseDetailView,
    meta: { title: '企业详情', group: '企业监管', menuKey: 'enterprise-directory' },
  },
  {
    path: 'enterprise/directory/:id/edit',
    name: 'enterprise-directory-edit',
    component: EnterpriseFormView,
    meta: { title: '编辑企业', group: '企业监管', menuKey: 'enterprise-directory' },
  },
  {
    path: 'space/building',
    name: 'space-building',
    component: RoomListView,
    meta: { title: '用房', group: '空间监管', menuKey: 'space-building' },
  },
  {
    path: 'space/building/new',
    name: 'space-building-create',
    component: RoomFormView,
    meta: { title: '新建用房', group: '空间监管', menuKey: 'space-building' },
  },
  {
    path: 'space/building/:id',
    name: 'space-building-detail',
    component: RoomDetailView,
    meta: { title: '用房详情', group: '空间监管', menuKey: 'space-building' },
  },
  {
    path: 'space/building/:id/edit',
    name: 'space-building-edit',
    component: RoomFormView,
    meta: { title: '编辑用房', group: '空间监管', menuKey: 'space-building' },
  },
  {
    path: 'space/idle',
    name: 'space-idle',
    component: IdleListView,
    meta: { title: '闲置', group: '空间监管', menuKey: 'space-idle' },
  },
  {
    path: 'space/idle/new',
    name: 'space-idle-create',
    component: IdleFormView,
    meta: { title: '新建闲置', group: '空间监管', menuKey: 'space-idle' },
  },
  {
    path: 'space/idle/:id',
    name: 'space-idle-detail',
    component: IdleDetailView,
    meta: { title: '闲置详情', group: '空间监管', menuKey: 'space-idle' },
  },
  {
    path: 'space/idle/:id/edit',
    name: 'space-idle-edit',
    component: IdleFormView,
    meta: { title: '编辑闲置', group: '空间监管', menuKey: 'space-idle' },
  },
]

const affairRoutes: RouteRecordRaw[] = ledgerModules.flatMap((mod) => {
  const base = mod.path.replace(/^\//, '')
  const meta = { group: mod.group, menuKey: mod.key, ledger: mod.key }
  return [
    {
      path: base,
      name: mod.key,
      component: LedgerListView,
      meta: { ...meta, title: mod.title },
    },
    {
      path: `${base}/new`,
      name: `${mod.key}-create`,
      component: LedgerFormView,
      meta: { ...meta, title: mod.createTitle },
    },
    {
      path: `${base}/:id`,
      name: `${mod.key}-detail`,
      component: LedgerDetailView,
      meta: { ...meta, title: mod.detailTitle },
    },
    {
      path: `${base}/:id/edit`,
      name: `${mod.key}-edit`,
      component: LedgerFormView,
      meta: { ...meta, title: mod.editTitle },
    },
  ]
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { title: '登录', public: true },
    },
    {
      path: '/',
      component: AdminLayout,
      redirect: '/workbench',
      children: [...registryRoutes, ...affairRoutes, ...leafRoutes(menus), { path: ':pathMatch(.*)*', redirect: '/workbench' }],
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  const title = to.meta.title ? `${to.meta.title} · 园区政府管理平台` : '园区政府管理平台'
  document.title = title

  if (to.meta.public) {
    if (to.name === 'login' && auth.isLoggedIn) return { path: '/workbench' }
    return true
  }
  if (!auth.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  return true
})

export default router
