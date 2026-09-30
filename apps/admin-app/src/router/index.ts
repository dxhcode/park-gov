import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { menus, type MenuNode } from '../config/menus'
import AdminLayout from '../layouts/AdminLayout.vue'
import PlaceholderView from '../views/PlaceholderView.vue'

function leafRoutes(nodes: MenuNode[], group?: string): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = []
  for (const node of nodes) {
    if (node.children?.length) {
      routes.push(...leafRoutes(node.children, node.title))
      continue
    }
    if (!node.path) continue
    routes.push({
      path: node.path.replace(/^\//, ''),
      name: node.key,
      component: PlaceholderView,
      meta: {
        title: node.title,
        group: group ?? node.title,
        hint: node.hint ?? '',
        slots: node.slots ?? [],
      },
    })
  }
  return routes
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AdminLayout,
      redirect: '/workbench',
      children: [
        ...leafRoutes(menus),
        { path: ':pathMatch(.*)*', redirect: '/workbench' },
      ],
    },
  ],
})

export default router
