<script setup lang="ts">
import { LoginPage } from '@park/components'
import type { LoginPayload } from '@park/components'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { demoAccounts, type DemoAccount } from '../auth/accounts'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const username = ref('zhoulan')
const password = ref('')
const error = ref('')

function fill(account: DemoAccount) {
  username.value = account.username
  password.value = account.password
  error.value = ''
}

function safeRedirect(value: unknown) {
  if (typeof value !== 'string') return '/workbench'
  if (!value.startsWith('/') || value.startsWith('//')) return '/workbench'
  return value
}

function onSubmit(payload: LoginPayload) {
  error.value = auth.login(payload.username, payload.password) ?? ''
  if (error.value) return
  void router.replace(safeRedirect(route.query.redirect))
}
</script>

<template>
  <LoginPage
    brand="园区政府管理平台"
    brand-subtitle="GOV"
    headline="进入监管工作台"
    description="企业名录、空间用房与闲置盘活的本地演示。登录状态只写在这台浏览器里，不会提交到服务器。"
    :error-message="error"
    :initial-username="username"
    :initial-password="password"
    title="登录"
    subtitle="点左侧姓名可填入用户名和密码。三位演示用户使用同一口令。"
    submit-text="进入工作台"
    @submit="onSubmit"
  >
    <template #points>
      <li v-for="account in demoAccounts" :key="account.username" class="account">
        <button type="button" @click="fill(account)">
          <strong>{{ account.displayName }}</strong>
          <span>{{ account.orgName }} · {{ account.dutyLabel }}</span>
          <code>{{ account.username }} / {{ account.password }}</code>
        </button>
      </li>
    </template>
    <template #hint>
      <span class="hint">演示账号写在左侧，不会提交到服务器。</span>
    </template>
  </LoginPage>
</template>

<style scoped>
.account {
  padding-left: 0;
}

.account::before {
  display: none;
}

.account button {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  width: 100%;
  padding: 12px 14px;
  color: inherit;
  text-align: left;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(198, 161, 91, 0.45);
  border-radius: 12px;
  cursor: pointer;
}

.account button:hover {
  background: rgba(255, 255, 255, 0.08);
}

.account strong {
  color: #f7fbff;
  font-size: 16px;
}

.account span,
.account code {
  color: rgba(236, 244, 252, 0.78);
  font-size: 13px;
}

.hint {
  color: var(--park-color-text-secondary, #5c6578);
}

@media (max-width: 860px) {
  :global(.park-login__points) {
    display: flex !important;
  }
}
</style>
