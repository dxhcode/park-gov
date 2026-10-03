import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useScreenStore = defineStore('screen', () => {
  const now = ref(new Date())
  const platformName = ref('园区政府管理平台')
  const focusParkId = ref('park-binjiang')
  let timer: number | undefined

  const dateText = computed(() =>
    new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'long',
    }).format(now.value),
  )

  const timeText = computed(() =>
    new Intl.DateTimeFormat('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(now.value),
  )

  function start() {
    stop()
    timer = window.setInterval(() => {
      now.value = new Date()
    }, 1000)
  }

  function stop() {
    if (timer !== undefined) window.clearInterval(timer)
    timer = undefined
  }

  function focusPark(id: string) {
    focusParkId.value = id
  }

  return { now, platformName, focusParkId, dateText, timeText, start, stop, focusPark }
})
