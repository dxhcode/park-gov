<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { demoAccounts, type DemoAccount } from '../auth/accounts'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const form = reactive({
  username: 'zhoulan',
  password: '',
})
const error = ref('')

function fill(account: DemoAccount) {
  form.username = account.username
  form.password = account.password
  error.value = ''
}

function safeRedirect(value: unknown) {
  if (typeof value !== 'string') return '/workbench'
  if (!value.startsWith('/') || value.startsWith('//')) return '/workbench'
  return value
}

function onSubmit() {
  error.value = auth.login(form.username, form.password) ?? ''
  if (error.value) return
  void router.replace(safeRedirect(route.query.redirect))
}
</script>

<template>
  <div class="login-screen">
    <section class="hero">
      <div class="seal" aria-hidden="true">园</div>
      <p class="eyebrow">PARK GOVERNANCE</p>
      <h1>园区政府管理平台</h1>
      <p class="lead">
        企业名录、空间用房与闲置盘活的本地演示。登录状态只写在这台浏览器里，不会提交到服务器。
      </p>
      <ul class="accounts">
        <li v-for="account in demoAccounts" :key="account.username">
          <button type="button" @click="fill(account)">
            <strong>{{ account.displayName }}</strong>
            <span>{{ account.orgName }} · {{ account.dutyLabel }}</span>
            <code>{{ account.username }} / {{ account.password }}</code>
          </button>
        </li>
      </ul>
    </section>

    <section class="panel">
      <p class="panel-kicker">值班入口</p>
      <h2>登录</h2>
      <p class="panel-note">点左侧账号可填入用户名和密码。三位演示用户使用同一口令。</p>
      <a-form layout="vertical" :model="form" @finish="onSubmit">
        <a-form-item label="用户名" name="username" :rules="[{ required: true, message: '请填写用户名' }]">
          <a-input v-model:value="form.username" size="large" autocomplete="username" placeholder="例如 zhoulan" />
        </a-form-item>
        <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请填写密码' }]">
          <a-input-password
            v-model:value="form.password"
            size="large"
            autocomplete="current-password"
            placeholder="Park@2026"
          />
        </a-form-item>
        <a-alert v-if="error" class="alert" type="error" show-icon :message="error" />
        <a-button type="primary" html-type="submit" size="large" block>进入工作台</a-button>
      </a-form>
    </section>
  </div>
</template>

<style scoped>
.login-screen {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(320px, 460px);
  min-height: 100%;
  background:
    radial-gradient(circle at 12% 0%, rgba(64, 148, 214, 0.28), transparent 36%),
    linear-gradient(160deg, #10243f 0%, #0b182b 52%, #08131f 100%);
}

.hero {
  padding: 72px 64px;
  color: #f7fbff;
}

.seal {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  margin-bottom: 28px;
  color: #f3d48a;
  font-weight: 700;
  font-size: 24px;
  background: radial-gradient(circle at 30% 30%, #1d4d7a, #0b1c33 70%);
  box-shadow:
    inset 0 0 0 1px rgba(243, 212, 138, 0.95),
    inset 0 0 0 5px rgba(8, 20, 36, 0.85),
    inset 0 0 0 6px rgba(243, 212, 138, 0.7);
}

.eyebrow {
  margin: 0 0 10px;
  color: rgba(226, 182, 87, 0.86);
  font-size: 12px;
  letter-spacing: 0.28em;
}

h1 {
  margin: 0;
  font-size: 40px;
  letter-spacing: 0.08em;
}

.lead {
  max-width: 520px;
  margin: 16px 0 28px;
  color: rgba(236, 244, 252, 0.78);
  line-height: 1.7;
}

.accounts {
  display: grid;
  gap: 12px;
  max-width: 520px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.accounts button {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  width: 100%;
  padding: 14px 16px;
  color: inherit;
  text-align: left;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(226, 182, 87, 0.28);
  border-radius: 14px;
  cursor: pointer;
}

.accounts button:hover {
  background: rgba(94, 196, 255, 0.1);
}

.accounts strong {
  font-size: 16px;
}

.accounts span,
.accounts code {
  color: rgba(236, 244, 252, 0.72);
  font-size: 13px;
}

.panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 28px;
  padding: 36px 32px;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 20px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
}

.panel-kicker {
  margin: 0 0 8px;
  color: #a67c12;
  font-size: 12px;
  letter-spacing: 0.28em;
}

h2 {
  margin: 0;
  color: #10243f;
  font-size: 28px;
}

.panel-note {
  margin: 8px 0 22px;
  color: #6d8298;
  line-height: 1.6;
}

.alert {
  margin-bottom: 16px;
}

@media (max-width: 900px) {
  .login-screen {
    grid-template-columns: 1fr;
  }

  .hero {
    padding: 32px 20px 8px;
  }

  h1 {
    font-size: 30px;
  }

  .panel {
    margin: 16px;
    padding: 24px 18px 28px;
  }
}
</style>
