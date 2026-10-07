<script setup lang="ts">
import { computed } from 'vue'
import type { Series } from '../mock/dashboard'

const props = defineProps<{
  labels: string[]
  series: Series[]
}>()

const uid = `line-${Math.random().toString(36).slice(2, 8)}`
const width = 320
const height = 150
const pad = 16

const max = computed(() => Math.max(...props.series.flatMap((item) => item.values), 1))

function points(values: number[]) {
  const step = (width - pad * 2) / Math.max(values.length - 1, 1)
  return values
    .map((value, index) => {
      const x = pad + index * step
      const y = height - pad - (value / max.value) * (height - pad * 2)
      return `${x},${y}`
    })
    .join(' ')
}

function lengthOf(values: number[]) {
  return Math.max(values.length * 80, 120)
}
</script>

<template>
  <div class="lines">
    <svg :viewBox="`0 0 ${width} ${height}`" role="img" aria-label="月度产值折线">
      <defs>
        <filter :id="`${uid}-glow`">
          <feGaussianBlur stdDeviation="1.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g class="grid">
        <line v-for="row in 4" :key="row" x1="12" :x2="width - 8" :y1="row * 32" :y2="row * 32" />
      </g>
      <polyline
        v-for="item in series"
        :key="item.name"
        fill="none"
        :stroke="item.color"
        stroke-width="2.4"
        :points="points(item.values)"
        :filter="`url(#${uid}-glow)`"
        :style="{ strokeDasharray: lengthOf(item.values), strokeDashoffset: 0 }"
        class="line"
      />
      <text
        v-for="(label, index) in labels"
        :key="label"
        :x="pad + index * ((width - pad * 2) / Math.max(labels.length - 1, 1))"
        :y="height - 2"
        text-anchor="middle"
      >
        {{ label }}
      </text>
    </svg>
    <p class="legend">
      <span v-for="item in series" :key="item.name">
        <i :style="{ background: item.color }" />
        {{ item.name }}
      </span>
    </p>
  </div>
</template>

<style scoped>
.lines {
  display: flex;
  flex-direction: column;
  height: 100%;
}

svg {
  width: 100%;
  height: 100%;
  min-height: 140px;
}

.grid line {
  stroke: rgba(126, 235, 255, 0.12);
}

.line {
  animation: dash 1.3s ease forwards;
}

text {
  fill: rgba(214, 236, 246, 0.62);
  font-size: 10px;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 4px 0 0;
  color: rgba(214, 236, 246, 0.78);
  font-size: 12px;
}

.legend span {
  display: inline-flex;
  gap: 6px;
  align-items: center;
}

.legend i {
  width: 14px;
  height: 3px;
  box-shadow: 0 0 8px currentColor;
}

@keyframes dash {
  from {
    stroke-dashoffset: 480;
  }
  to {
    stroke-dashoffset: 0;
  }
}
</style>
