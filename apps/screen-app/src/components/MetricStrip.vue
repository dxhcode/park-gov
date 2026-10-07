<script setup lang="ts">
import { ScreenKpi } from '@park/components'
import type { Metric } from '../mock/dashboard'

defineProps<{
  items: Metric[]
}>()
</script>

<template>
  <div class="strip">
    <article v-for="item in items" :key="item.label" :class="item.tone ?? 'cyan'">
      <ScreenKpi
        :label="item.label"
        :value="item.value"
        :unit="item.suffix"
        :decimals="item.digits ?? 0"
        :hint="item.hint"
      />
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
  background: var(--park-glass-bg);
  border: 1px solid var(--park-glass-border);
  box-shadow: var(--park-glow);
}

article::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--park-color-highlight, #67e8f9), transparent);
}

.gold :deep(.park-kpi__value) {
  color: var(--park-gold-bright, #f3d48a);
}

.rose :deep(.park-kpi__value) {
  color: #ffb4c2;
}

@media (max-width: 900px) {
  .strip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
