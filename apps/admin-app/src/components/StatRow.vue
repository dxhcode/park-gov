<script setup lang="ts">
import { KpiStat } from '@park/components'

defineProps<{
  items: { label: string; value: string | number; hint?: string }[]
}>()
</script>

<template>
  <div class="stat-row">
    <article v-for="item in items" :key="item.label" class="stat">
      <KpiStat :label="item.label" :value="item.value" :hint="item.hint" />
    </article>
  </div>
</template>

<style scoped>
.stat-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.stat {
  position: relative;
  overflow: hidden;
  padding: 16px 16px 14px;
  background: linear-gradient(180deg, var(--park-color-surface, #fff), color-mix(in srgb, var(--park-color-bg) 65%, white));
  border: 1px solid var(--park-color-border);
  border-radius: var(--park-radius, 10px);
  box-shadow: var(--park-shadow);
}

.stat::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, var(--park-color-primary), var(--park-color-highlight));
}

@media (max-width: 900px) {
  .stat-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
