<script setup lang="ts">
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import { AdminLayout as ParkAdminLayout, AppLogo, RouteMotion } from '@park/components'
import { parkMotion } from '@park/theme'
import type { ItemType } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import { computed, h, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { findNode, menus, type MenuNode } from '../config/menus'
import { useAffairsStore } from '../stores/affairs'
import { useAppStore } from '../stores/app'
import { useAuthStore } from '../stores/auth'
import { useRegistryStore } from '../stores/registry'

const route = useRoute()
const router = useRouter()
const app = useAppStore()
const auth = useAuthStore()
const registry = useRegistryStore()
const affairs = useAffairsStore()

function toItems(nodes: MenuNode[]): ItemType[] {
  return nodes.map((node) => {
    const children = node.children?.length ? toItems(node.children) : undefined
    return {
      key: node.key,
      class: parkMotion.menuPulse,
      icon: node.icon ? () => h(node.icon!) : undefined,
      label: node.title,
      ...(children ? { children } : {}),
    }
  })
}

const menuItems = computed(() => toItems(menus))
const selectedKeys = computed(() => {
  const key = route.meta.menuKey ?? route.name
  return key ? [String(key)] : []
})
const openKeys = ref(menus.filter((node) => node.children?.length).map((node) => node.key))

watch(
  () => app.collapsed,
  (collapsed) => {
    openKeys.value = collapsed
      ? []
      : menus.filter((node) => node.children?.length).map((node) => node.key)
  },
)

const title = computed(() => route.meta.title ?? '')
const group = computed(() => route.meta.group ?? '')
const showGroup = computed(() => group.value && group.value !== title.value)
const user = computed(() => auth.user)
const surname = computed(() => user.value?.displayName.slice(0, 1) ?? '园')

const today = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
}).format(new Date())

const isNarrow = ref(false)
const collapsedWidth = computed(() => (isNarrow.value ? 0 : 80))
let viewportQuery: MediaQueryList | undefined

function onViewportChange(event?: MediaQueryListEvent) {
  const matches = event?.matches ?? viewportQuery?.matches ?? false
  const enteredNarrow = matches && !isNarrow.value
  const leftNarrow = !matches && isNarrow.value
  isNarrow.value = matches
  if (enteredNarrow) app.collapsed = true
  if (leftNarrow) app.collapsed = false
}

onMounted(() => {
  viewportQuery = window.matchMedia('(max-width: 960px)')
  onViewportChange()
  viewportQuery.addEventListener('change', onViewportChange)
})

onUnmounted(() => {
  viewportQuery?.removeEventListener('change', onViewportChange)
})

function onMenuClick(info: { key: string | number }) {
  const node = findNode(menus, String(info.key))
  if (!node?.path) return
  void router.push(node.path)
  if (isNarrow.value) app.collapsed = true
}

function onUserMenu(info: { key: string | number }) {
  if (info.key === 'logout') {
    auth.logout()
    void router.replace({ name: 'login' })
    return
  }
  if (info.key === 'reset') {
    registry.reset()
    affairs.reset()
    message.success('已恢复初始样例数据')
  }
}
</script>

<template>
  <div class="gov-admin">
    <ParkAdminLayout
      v-model:collapsed="app.collapsed"
      :title="app.platformName"
      subtitle="GOV"
      :sider-width="248"
      :collapsed-width="collapsedWidth"
    >
      <template #logo>
        <AppLogo v-show="!app.collapsed" :title="app.platformName" subtitle="PARK GOVERNANCE">
          <template #mark>
            <div class="seal" aria-hidden="true">园</div>
          </template>
        </AppLogo>
        <div v-show="app.collapsed" class="seal" aria-hidden="true">园</div>
      </template>
      <template #sider>
        <div class="menu-scroll">
          <a-menu
            v-model:open-keys="openKeys"
            :selected-keys="selectedKeys"
            mode="inline"
            theme="dark"
            :items="menuItems"
            @click="onMenuClick"
          />
        </div>
        <p v-show="!app.collapsed" class="sider-foot">本地演示 · 数据不落库</p>
      </template>
      <template #header>
        <a-button
          type="text"
          class="fold"
          :aria-label="app.collapsed ? '展开菜单' : '折叠菜单'"
          @click="app.toggleCollapsed()"
        >
          <MenuUnfoldOutlined v-if="app.collapsed" />
          <MenuFoldOutlined v-else />
        </a-button>
        <div class="crumb-wrap">
          <a-breadcrumb>
            <a-breadcrumb-item>园区政府管理平台</a-breadcrumb-item>
            <a-breadcrumb-item v-if="showGroup">{{ group }}</a-breadcrumb-item>
            <a-breadcrumb-item>{{ title }}</a-breadcrumb-item>
          </a-breadcrumb>
          <p class="today">{{ today }}</p>
        </div>
      </template>
      <template #extra>
        <a-tag class="demo-tag">本地演示</a-tag>
        <a-dropdown v-if="user" placement="bottomRight">
          <button class="user-chip" type="button">
            <span class="avatar">{{ surname }}</span>
            <span class="user-meta">
              <strong>{{ user.displayName }}</strong>
              <em>{{ user.orgName }} · {{ user.dutyLabel }}</em>
            </span>
          </button>
          <template #overlay>
            <a-menu @click="onUserMenu">
              <a-menu-item key="reset">恢复样例数据</a-menu-item>
              <a-menu-item key="logout">退出登录</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>

      <router-view v-slot="{ Component, route: childRoute }">
        <RouteMotion :name="parkMotion.routeFade">
          <div :key="childRoute.path" class="route-stage admin-content">
            <component :is="Component" />
          </div>
        </RouteMotion>
      </router-view>
    </ParkAdminLayout>
    <button
      v-if="isNarrow && !app.collapsed"
      class="sider-mask"
      type="button"
      aria-label="关闭菜单"
      @click="app.collapsed = true"
    />
  </div>
</template>

<style scoped>
.gov-admin {
  position: relative;
  height: 100%;
}

.gov-admin :deep(.park-admin) {
  height: 100%;
  min-height: 0;
}

.gov-admin :deep(.park-admin__collapse) {
  display: none;
}

.gov-admin :deep(.park-admin__nav) {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.gov-admin :deep(.park-admin__header) {
  height: 72px;
  padding-inline: 12px 20px;
  border-bottom: 1px solid color-mix(in srgb, var(--park-color-highlight) 45%, transparent);
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--park-color-highlight) 28%, transparent), transparent 32%),
    var(--park-header-bg);
}

.gov-admin :deep(.park-admin__content) {
  overflow: auto;
  padding: 22px 24px 32px;
  background-color: var(--park-color-bg);
  background-image: radial-gradient(color-mix(in srgb, var(--park-color-primary) 14%, transparent) 1px, transparent 1px);
  background-size: 22px 22px;
}

.seal {
  display: grid;
  flex: none;
  place-items: center;
  width: 44px;
  height: 44px;
  color: var(--park-gold-bright, #f3d48a);
  font-weight: 700;
  font-size: 20px;
  background: radial-gradient(circle at 30% 30%, #243044, var(--park-ink, #0e1320) 70%);
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--park-color-highlight) 95%, transparent),
    inset 0 0 0 4px rgba(8, 20, 36, 0.85),
    inset 0 0 0 5px color-mix(in srgb, var(--park-color-highlight) 70%, transparent);
}

.menu-scroll {
  flex: 1;
  overflow: auto;
  padding: 12px 8px 16px;
}

.menu-scroll :deep(.ant-menu) {
  border-inline-end: none !important;
  background: transparent;
}

.route-stage {
  min-height: 240px;
}

.sider-foot {
  margin: 0;
  padding: 12px 16px 16px;
  color: color-mix(in srgb, var(--park-color-highlight) 72%, white);
  font-size: 12px;
  letter-spacing: 0.08em;
  border-top: 1px solid color-mix(in srgb, var(--park-color-highlight) 28%, transparent);
}

.gov-admin :deep(.ant-breadcrumb),
.gov-admin :deep(.ant-breadcrumb a),
.gov-admin :deep(.ant-breadcrumb-separator) {
  color: rgba(244, 247, 255, 0.68);
}

.gov-admin :deep(.ant-breadcrumb li:last-child) {
  color: #f4f7ff;
}

.fold {
  width: 40px;
  height: 40px;
  color: var(--park-gold-bright, #f3d48a);
  font-size: 18px;
}

.fold:hover {
  color: #fff8e8 !important;
  background: rgba(255, 255, 255, 0.06) !important;
}

.today {
  margin: 4px 0 0;
  color: color-mix(in srgb, var(--park-gold-bright, #f3d48a) 78%, transparent);
  font-size: 12px;
}

.demo-tag {
  margin: 0;
  color: var(--park-gold-bright, #f3d48a);
  background: color-mix(in srgb, var(--park-color-highlight) 16%, transparent);
  border-color: color-mix(in srgb, var(--park-color-highlight) 55%, transparent);
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 12px 4px 4px;
  color: #f7fbff;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid color-mix(in srgb, var(--park-color-highlight) 55%, transparent);
  border-radius: 999px;
  cursor: pointer;
}

.avatar {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  color: #1a1408;
  font-weight: 700;
  background: linear-gradient(160deg, var(--park-gold-bright, #f3d48a), var(--park-color-highlight));
  border-radius: 50%;
}

.user-meta strong,
.user-meta em {
  display: block;
  font-style: normal;
  text-align: left;
}

.user-meta strong {
  color: #f7fbff;
  font-size: 13px;
}

.user-meta em {
  margin-top: 2px;
  color: rgba(232, 240, 248, 0.62);
  font-size: 12px;
}

.sider-mask {
  position: absolute;
  inset: 0;
  z-index: 30;
  padding: 0;
  background: rgba(8, 18, 32, 0.48);
  border: 0;
  cursor: pointer;
}

@media (max-width: 960px) {
  .gov-admin :deep(.park-admin__sider) {
    position: absolute !important;
    z-index: 40;
    height: 100%;
  }

  .demo-tag,
  .user-meta,
  .today {
    display: none;
  }

  .gov-admin :deep(.park-admin__content) {
    padding: 16px;
  }
}
</style>
