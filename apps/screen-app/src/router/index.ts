import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { scenes } from '../config/scenes'
import ScreenLayout from '../layouts/ScreenLayout.vue'
import SceneView from '../views/SceneView.vue'

const sceneRoutes: RouteRecordRaw[] = scenes.map((scene) => ({
  path: scene.path.replace(/^\//, ''),
  name: scene.key,
  component: SceneView,
  meta: {
    title: scene.title,
    group: '态势大屏',
    hint: scene.hint,
    slots: scene.slots,
    code: scene.code,
  },
}))

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: ScreenLayout,
      redirect: '/overview',
      children: [...sceneRoutes, { path: ':pathMatch(.*)*', redirect: '/overview' }],
    },
  ],
})

export default router
