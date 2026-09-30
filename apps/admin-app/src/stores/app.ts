import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const collapsed = ref(false)
  const platformName = ref('园区政府管理平台')
  const orgName = ref('园区管理委员会')
  const dutyLabel = ref('值班席 · 未登录')

  function toggleCollapsed() {
    collapsed.value = !collapsed.value
  }

  return {
    collapsed,
    platformName,
    orgName,
    dutyLabel,
    toggleCollapsed,
  }
})
