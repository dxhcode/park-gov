<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  hint?: string
}>()
</script>

<template>
  <section class="module-page">
    <header class="module-banner">
      <div>
        <p class="eyebrow">{{ eyebrow }}</p>
        <h1>{{ title }}</h1>
        <p v-if="hint" class="hint">{{ hint }}</p>
      </div>
      <div v-if="$slots.extra" class="extra">
        <slot name="extra" />
      </div>
    </header>
    <slot />
  </section>
</template>

<style scoped>
.module-page {
  max-width: 1180px;
}

.module-banner {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
  padding: 22px 24px;
  background:
    linear-gradient(120deg, rgba(12, 79, 138, 0.96), rgba(14, 22, 40, 0.94) 58%, rgba(28, 42, 58, 0.9)),
    #0c4f8a;
  border-radius: 16px;
  box-shadow:
    0 16px 40px rgba(12, 40, 72, 0.16),
    inset 0 1px 0 rgba(243, 212, 138, 0.35);
}

.eyebrow {
  margin: 0 0 8px;
  color: #f0d48a;
  font-size: 12px;
  letter-spacing: 0.32em;
}

h1 {
  margin: 0;
  color: #f8fbff;
  font-size: 32px;
  letter-spacing: 0.06em;
}

.hint {
  max-width: 720px;
  margin: 10px 0 0;
  color: rgba(236, 244, 252, 0.82);
  line-height: 1.7;
}

.extra {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

@media (max-width: 760px) {
  .module-banner {
    flex-direction: column;
  }

  h1 {
    font-size: 26px;
  }
}
</style>
