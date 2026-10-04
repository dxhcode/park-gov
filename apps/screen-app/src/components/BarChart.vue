<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { BarItem } from '../mock/dashboard'

const props = defineProps<{
  items: BarItem[]
}>()

const ready = ref(false)
const max = computed(() => Math.max(...props.items.map((item) => item.value), 1))

onMounted(() => {
  requestAnimationFrame(() => {
    ready.value = true
  })
})
</script>

<template>
  <div class="bars" :class="{ ready }">
    <div v-for="item in items" :key="item.label" class="row">
      <span>{{ item.label }}</span>
      <div class="rail" :style="{ '--p': item.value / max }">
        <i />
      </div>
      <strong>{{ item.display ?? item.value }}</strong>
    </div>
  </div>
</template>

<style scoped>
.bars {
  display: flex;
  flex-direction: column;
  gap: 9px;
  justify-content: center;
  height: 100%;
}

.row {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;
}

span,
strong {
  color: rgba(232, 246, 255, 0.86);
  font-size: 12px;
}

strong {
  font-variant-numeric: tabular-nums;
  color: var(--park-gold-bright, #f3d48a);
}

.rail {
  height: 8px;
  overflow: hidden;
  background: rgba(126, 235, 255, 0.08);
  box-shadow: inset 0 0 0 1px rgba(126, 235, 255, 0.16);
}

.rail i {
  display: block;
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, color-mix(in srgb, var(--park-cyan, #7eebff) 22%, transparent), var(--park-cyan, #7eebff) 70%, var(--park-gold, #e2b657));
  box-shadow: 0 0 12px color-mix(in srgb, var(--park-cyan, #7eebff) 65%, transparent);
  transition: width 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.ready .rail i {
  width: calc(var(--p) * 100%);
}
</style>
