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
  padding: 14px 16px 12px;
  background: linear-gradient(180deg, #ffffff, #f7fafc);
  border: 1px solid rgba(16, 52, 92, 0.06);
  border-radius: 14px;
  box-shadow: 0 12px 28px rgba(18, 46, 82, 0.05);
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
  letter-spacing: 0.02em;
}

@media (max-width: 900px) {
  .stat-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
