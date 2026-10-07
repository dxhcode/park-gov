<script setup lang="ts">
import { computed } from 'vue'
import type { RingItem } from '../mock/dashboard'

const props = defineProps<{
  items: RingItem[]
  center: string
  caption: string
}>()

const uid = `ring-${Math.random().toString(36).slice(2, 8)}`
const radius = 42
const circumference = 2 * Math.PI * radius

const arcs = computed(() => {
  const total = props.items.reduce((sum, item) => sum + item.value, 0) || 1
  let cursor = 0
  return props.items.map((item) => {
    const len = (item.value / total) * circumference
    const arc = { ...item, len, gap: circumference - len, offset: cursor }
    cursor += len
    return arc
  })
})
</script>

<template>
  <div class="ring">
    <svg viewBox="0 0 120 120" role="img" :aria-label="caption">
      <defs>
        <filter :id="`${uid}-glow`" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="60" cy="60" :r="radius" class="track" />
      <circle
        v-for="arc in arcs"
        :key="arc.label"
        cx="60"
        cy="60"
        :r="radius"
        fill="none"
        :stroke="arc.color"
        stroke-width="10"
        stroke-linecap="butt"
        :stroke-dasharray="`${arc.len} ${arc.gap}`"
        :stroke-dashoffset="-arc.offset"
        :filter="`url(#${uid}-glow)`"
        class="arc"
        transform="rotate(-90 60 60)"
      />
      <text x="60" y="56" text-anchor="middle" class="center">{{ center }}</text>
      <text x="60" y="74" text-anchor="middle" class="cap">{{ caption }}</text>
    </svg>
    <ul>
      <li v-for="item in items" :key="item.label">
        <i :style="{ background: item.color }" />
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.ring {
  display: grid;
  grid-template-columns: 148px minmax(0, 1fr);
  gap: 8px;
  align-items: center;
  height: 100%;
}

svg {
  width: 148px;
  height: 148px;
}

.track {
  fill: none;
  stroke: rgba(126, 235, 255, 0.12);
  stroke-width: 10;
}

.arc {
  transform-origin: 60px 60px;
  animation: pop 0.9s ease;
}

.center {
  fill: #f4fbff;
  font-size: 18px;
  font-weight: 700;
}

.cap {
  fill: rgba(214, 236, 246, 0.72);
  font-size: 9px;
  letter-spacing: 0.08em;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

li {
  display: grid;
  grid-template-columns: 8px 1fr auto;
  gap: 8px;
  align-items: center;
  margin: 6px 0;
  color: rgba(232, 246, 255, 0.86);
  font-size: 13px;
}

i {
  width: 8px;
  height: 8px;
  box-shadow: 0 0 8px currentColor;
}

strong {
  color: var(--park-gold-bright, #f3d48a);
  font-variant-numeric: tabular-nums;
}

@keyframes pop {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 720px) {
  .ring {
    grid-template-columns: 1fr;
    justify-items: center;
  }
}
</style>
