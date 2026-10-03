<script setup lang="ts">
import { computed } from 'vue'
import type { FeedItem } from '../mock/dashboard'

const props = defineProps<{
  items: FeedItem[]
}>()

const loop = computed(() => [...props.items, ...props.items])

function tone(level: string) {
  if (level === '紧急' || level === '超时' || level === '高风险') return 'rose'
  if (level === '关注' || level === '临期' || level === '短板' || level === '待受理') return 'gold'
  return 'cyan'
}
</script>

<template>
  <div class="viewport">
    <div class="track" :style="{ animationDuration: `${Math.max(items.length, 1) * 2.8}s` }">
      <article v-for="(item, index) in loop" :key="`${item.id}-${index}`">
        <b :class="tone(item.level)">{{ item.level }}</b>
        <div>
          <strong>{{ item.title }}</strong>
          <em>{{ item.meta }}</em>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.viewport {
  flex: 1;
  min-height: 160px;
  overflow: hidden;
}

.track {
  animation: feed linear infinite;
}

.viewport:hover .track {
  animation-play-state: paused;
}

article {
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr);
  gap: 8px;
  align-items: start;
  padding: 8px 0;
  border-bottom: 1px solid rgba(126, 235, 255, 0.12);
}

b {
  display: inline-grid;
  place-items: center;
  height: 22px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
}

.rose {
  color: #ffd0d8;
  background: rgba(255, 90, 120, 0.2);
  box-shadow: inset 0 0 0 1px rgba(255, 122, 144, 0.7);
}

.gold {
  color: #ffe7ae;
  background: rgba(226, 182, 87, 0.16);
  box-shadow: inset 0 0 0 1px rgba(226, 182, 87, 0.7);
}

.cyan {
  color: #d8f8ff;
  background: rgba(126, 235, 255, 0.12);
  box-shadow: inset 0 0 0 1px rgba(126, 235, 255, 0.55);
}

strong,
em {
  display: block;
}

strong {
  color: #f4fbff;
  font-size: 13px;
  font-weight: 600;
}

em {
  margin-top: 2px;
  color: rgba(190, 226, 240, 0.7);
  font-style: normal;
  font-size: 12px;
}

@keyframes feed {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-50%);
  }
}
</style>
