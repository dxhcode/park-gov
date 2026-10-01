import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const collapsed = ref(false)
  const platformName = ref('园区政府管理平台')

  function toggleCollapsed() {
    collapsed.value = !collapsed.value
  }

  return {
    collapsed,
    platformName,
    toggleCollapsed,
  }
})
