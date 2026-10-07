import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { SESSION_KEY, demoAccounts, type SessionUser } from '../auth/accounts'

function readSession(): SessionUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<SessionUser>
    if (!parsed.username || !parsed.displayName || !parsed.orgName || !parsed.dutyLabel) return null
    return {
      username: parsed.username,
      displayName: parsed.displayName,
      orgName: parsed.orgName,
      dutyLabel: parsed.dutyLabel,
      role: parsed.role ?? 'duty',
      loggedInAt: parsed.loggedInAt ?? '',
    }
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<SessionUser | null>(readSession())
  const isLoggedIn = computed(() => user.value !== null)

  function login(username: string, password: string): string | null {
    const account = demoAccounts.find(
      (item) => item.username === username.trim() && item.password === password,
    )
    if (!account) return '账号或密码不正确'
    const session: SessionUser = {
      username: account.username,
      displayName: account.displayName,
      orgName: account.orgName,
      dutyLabel: account.dutyLabel,
      role: account.role,
      loggedInAt: new Date().toISOString(),
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    user.value = session
    return null
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY)
    user.value = null
  }

  return { user, isLoggedIn, login, logout }
})
