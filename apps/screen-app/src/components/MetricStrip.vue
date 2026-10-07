<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Metric } from '../mock/dashboard'

const props = defineProps<{
  items: Metric[]
}>()

const shown = ref<number[]>([])

function animate() {
  const targets = props.items.map((item) => item.value)
  const from = shown.value.length === targets.length ? [...shown.value] : targets.map(() => 0)
  const start = performance.now()
  function frame(now: number) {
    const t = Math.min(1, (now - start) / 780)
    const eased = 1 - (1 - t) ** 3
    shown.value = targets.map((target, index) => from[index]! + (target - from[index]!) * eased)
    if (t < 1) requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

onMounted(animate)
watch(
  () => props.items.map((item) => item.value).join('|'),
  () => animate(),
)

function text(index: number) {
  const item = props.items[index]
  if (!item) return ''
  const raw = shown.value[index] ?? 0
  const digits = item.digits ?? 0
  const formatted = raw.toLocaleString('zh-CN', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
  return `${formatted}${item.suffix ?? ''}`
}
</script>

<template>
  <div class="strip">
    <article v-for="(item, index) in items" :key="item.label" :class="item.tone ?? 'cyan'">
      <span>{{ item.label }}</span>
      <strong>{{ text(index) }}</strong>
      <em>{{ item.hint }}</em>
    </article>
  </div>
</template>

<style scoped>
.strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--park-gap, 12px);
}

article {
  position: relative;
  padding: 10px 12px 8px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(16, 48, 74, 0.72), rgba(6, 16, 28, 0.55));
  border: 1px solid rgba(126, 235, 255, 0.28);
  box-shadow: inset 0 0 18px rgba(63, 212, 255, 0.08);
}

article::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--park-cyan, #7eebff), transparent);
  animation: scanline 3.2s linear infinite;
}

span,
em {
  display: block;
  color: rgba(214, 236, 246, 0.72);
  font-style: normal;
  font-size: 12px;
  letter-spacing: 0.12em;
}

strong {
  display: block;
  margin: 4px 0 2px;
  color: #f4fbff;
  font-size: 28px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.04em;
  text-shadow: 0 0 16px rgba(126, 235, 255, 0.35);
}

.gold strong {
  color: var(--park-gold-bright, #f3d48a);
  text-shadow: 0 0 16px color-mix(in srgb, var(--park-gold, #e2b657) 35%, transparent);
}

.rose strong {
  color: #ffb4c2;
  text-shadow: 0 0 16px color-mix(in srgb, var(--park-rose, #ff7a90) 40%, transparent);
}

@keyframes scanline {
  from {
    transform: translateX(-40%);
  }
  to {
    transform: translateX(40%);
  }
}

@media (max-width: 900px) {
  .strip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  strong {
    font-size: 22px;
  }
}
</style>
