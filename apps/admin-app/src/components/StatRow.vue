<script setup lang="ts">
defineProps<{
  items: { label: string; value: string | number; hint?: string }[]
}>()
</script>

<template>
  <div class="stat-row">
    <article v-for="item in items" :key="item.label" class="stat">
      <span>{{ item.label }}</span>
      <strong>{{ item.value }}</strong>
      <em v-if="item.hint">{{ item.hint }}</em>
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
  background: linear-gradient(180deg, #ffffff, #f7fafc);
  border: 1px solid rgba(16, 52, 92, 0.06);
  border-radius: var(--park-radius, 14px);
  box-shadow: var(--park-shadow, 0 12px 28px rgba(18, 46, 82, 0.06));
}

.stat::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, var(--park-color-primary, #0c4f8a), var(--park-gold, #e2b657));
}

.stat span,
.stat em {
  display: block;
  color: #6d8298;
  font-style: normal;
  font-size: 12px;
}

.stat strong {
  display: block;
  margin: 6px 0 4px;
  color: #10243f;
  font-size: 26px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
}

@media (max-width: 900px) {
  .stat-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
