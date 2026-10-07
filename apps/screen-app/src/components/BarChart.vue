<script setup lang="ts">
import { computed } from 'vue'
import { ScreenChart } from '@park/components'
import type { BarItem } from '../mock/dashboard'

const props = defineProps<{
  items: BarItem[]
}>()

const categories = computed(() => props.items.map((item) => item.label))
const series = computed(() => [{ name: '数值', data: props.items.map((item) => item.value) }])
</script>

<template>
  <div class="bars">
    <ScreenChart kind="bar" label="柱状图" :categories="categories" :series="series" />
    <ul class="readout">
      <li v-for="item in items" :key="item.label">
        <span>{{ item.label }}</span>
        <strong>{{ item.display ?? item.value }}</strong>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.bars {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
}

.readout {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.readout li {
  display: flex;
  gap: 6px;
  align-items: baseline;
  color: var(--park-color-text-secondary, rgba(190, 226, 240, 0.72));
  font-size: 12px;
}

.readout strong {
  color: var(--park-gold-bright, #f3d48a);
  font-weight: 650;
}
</style>
