<script setup lang="ts">
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import type { ItemType } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import { computed, h, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { findNode, menus, type MenuNode } from '../config/menus'
import { useAppStore } from '../stores/app'
import { useAuthStore } from '../stores/auth'
import { useRegistryStore } from '../stores/registry'

const route = useRoute()
const router = useRouter()
const app = useAppStore()
const auth = useAuthStore()
const registry = useRegistryStore()

function toItems(nodes: MenuNode[]): ItemType[] {
  return nodes.map((node) => {
    const children = node.children?.length ? toItems(node.children) : undefined
    return {
      key: node.key,
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
    message.success('已恢复初始样例数据')
  }
}
</script>

<template>
  <a-layout class="admin-shell">
    <a-layout-sider
      v-model:collapsed="app.collapsed"
      class="admin-sider"
      :width="248"
      :collapsed-width="isNarrow ? 0 : 80"
      collapsible
      :trigger="null"
      theme="dark"
    >
      <div class="brand">
        <div class="seal" aria-hidden="true">园</div>
        <div v-show="!app.collapsed" class="brand-text">
          <strong>{{ app.platformName }}</strong>
          <span>PARK GOVERNANCE</span>
        </div>
      </div>
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
    </a-layout-sider>
    <button
      v-if="isNarrow && !app.collapsed"
      class="sider-mask"
      type="button"
      aria-label="关闭菜单"
      @click="app.collapsed = true"
    />

    <a-layout class="admin-body">
      <a-layout-header class="admin-header">
        <div class="header-left">
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
        </div>
        <div class="header-right">
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
        </div>
      </a-layout-header>
      <a-layout-content class="admin-content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.admin-shell {
  height: 100%;
  background: var(--park-color-bg, #e8eef5);
}

.admin-sider {
  background:
    radial-gradient(circle at 18% 0%, rgba(64, 148, 214, 0.32), transparent 42%),
    linear-gradient(180deg, #152847 0%, #0e1b30 46%, #0a1424 100%) !important;
  border-right: 1px solid rgba(226, 182, 87, 0.32);
  box-shadow: 8px 0 32px rgba(8, 20, 36, 0.22);
}

.admin-sider :deep(.ant-layout-sider-children) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 84px;
  padding: 0 16px;
  border-bottom: 1px solid rgba(226, 182, 87, 0.28);
}

.seal {
  display: grid;
  flex: none;
  place-items: center;
  width: 44px;
  height: 44px;
  color: #f3d48a;
  font-weight: 700;
  font-size: 20px;
  background: radial-gradient(circle at 30% 30%, #1d4d7a, #0b1c33 70%);
  box-shadow:
    inset 0 0 0 1px rgba(243, 212, 138, 0.95),
    inset 0 0 0 4px rgba(8, 20, 36, 0.85),
    inset 0 0 0 5px rgba(243, 212, 138, 0.7);
}

.brand-text {
  min-width: 0;
  color: #f7fbff;
}

.brand-text strong {
  display: block;
  overflow: hidden;
  font-size: 15px;
  letter-spacing: 0.04em;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.brand-text span {
  display: block;
  margin-top: 3px;
  color: rgba(226, 182, 87, 0.82);
  font-size: 10px;
  letter-spacing: 0.16em;
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

.menu-scroll :deep(.ant-menu-item-selected) {
  box-shadow: inset 3px 0 0 #e2b657;
}

.sider-foot {
  margin: 0;
  padding: 12px 16px 16px;
  color: rgba(226, 182, 87, 0.72);
  font-size: 12px;
  letter-spacing: 0.08em;
  border-top: 1px solid rgba(226, 182, 87, 0.18);
}

.admin-body {
  min-width: 0;
  background: #e8eef5;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  padding: 0 20px 0 8px;
  line-height: 1.2;
  background:
    linear-gradient(90deg, rgba(226, 182, 87, 0.45), transparent 32%),
    linear-gradient(180deg, #15233a 0%, #0e1628 100%);
  border-bottom: 1px solid rgba(226, 182, 87, 0.38);
  box-shadow: 0 12px 28px rgba(8, 16, 32, 0.16);
}

.admin-header :deep(.ant-breadcrumb),
.admin-header :deep(.ant-breadcrumb a),
.admin-header :deep(.ant-breadcrumb-separator) {
  color: rgba(244, 247, 255, 0.68);
}

.admin-header :deep(.ant-breadcrumb li:last-child) {
  color: #f4f7ff;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.fold {
  width: 40px;
  height: 40px;
  color: #f4d78a;
  font-size: 18px;
}

.fold:hover {
  color: #fff8e8 !important;
  background: rgba(255, 255, 255, 0.06) !important;
}

.today {
  margin: 4px 0 0;
  color: rgba(243, 212, 138, 0.78);
  font-size: 12px;
}

.demo-tag {
  margin: 0;
  color: #f3d48a;
  background: rgba(226, 182, 87, 0.12);
  border-color: rgba(226, 182, 87, 0.45);
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 12px 4px 4px;
  color: #f7fbff;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(226, 182, 87, 0.4);
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
  background: linear-gradient(160deg, #f3d48a, #c6a15b);
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

.admin-content {
  overflow: auto;
  padding: 22px 24px 32px;
  background-color: #e8eef5;
  background-image: radial-gradient(rgba(20, 54, 92, 0.09) 1px, transparent 1px);
  background-size: 22px 22px;
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
  .admin-shell {
    position: relative;
  }

  .admin-sider {
    position: absolute !important;
    z-index: 40;
    height: 100%;
  }

  .demo-tag,
  .user-meta,
  .today {
    display: none;
  }

  .admin-content {
    padding: 16px;
  }
}
</style>
