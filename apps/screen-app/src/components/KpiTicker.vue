<script setup lang="ts">
import { computed } from 'vue'
import type { TickerItem } from '../mock/dashboard'

const props = defineProps<{
  items: TickerItem[]
}>()

const loop = computed(() => [...props.items, ...props.items])
</script>

<template>
  <div class="ticker" aria-label="指标滚动条">
    <div class="track" :style="{ animationDuration: `${Math.max(items.length, 1) * 4.6}s` }">
      <span v-for="(item, index) in loop" :key="`${item.label}-${index}`">
        <em>{{ item.label }}</em>
        {{ item.value }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.ticker {
  overflow: hidden;
  border: 1px solid rgba(226, 182, 87, 0.35);
  background: rgba(8, 22, 36, 0.55);
  box-shadow: inset 0 0 18px rgba(226, 182, 87, 0.06);
}

.track {
  display: flex;
  width: max-content;
  animation: ticker linear infinite;
}

.ticker:hover .track {
  animation-play-state: paused;
}

span {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 7px 22px;
  color: #f4fbff;
  font-size: 13px;
  white-space: nowrap;
  border-right: 1px solid rgba(126, 235, 255, 0.16);
}

em {
  color: #e2b657;
  font-style: normal;
  letter-spacing: 0.12em;
}

@keyframes ticker {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
</style>
