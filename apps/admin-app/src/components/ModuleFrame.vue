<script setup lang="ts">
import { PageHeader } from '@park/components'

defineProps<{
  eyebrow: string
  title: string
  hint?: string
}>()
</script>

<template>
  <section class="module-page">
    <PageHeader class="module-banner" :eyebrow="eyebrow" :title="title" :subtitle="hint">
      <template v-if="$slots.extra" #extra>
        <slot name="extra" />
      </template>
    </PageHeader>
    <slot />
  </section>
</template>

<style scoped>
.module-page {
  max-width: 1180px;
}

.module-banner {
  align-items: flex-start;
  margin-bottom: 18px;
  padding: 22px 24px;
  background:
    linear-gradient(120deg, color-mix(in srgb, var(--park-ink) 88%, var(--park-color-primary)), var(--park-ink) 62%),
    var(--park-ink);
  border: 0;
  border-radius: var(--park-radius-lg, 16px);
  box-shadow:
    0 16px 40px rgba(12, 40, 72, 0.16),
    inset 0 1px 0 color-mix(in srgb, var(--park-gold-bright, #f3d48a) 35%, transparent);
}

.module-banner :deep(.park-page-header__main) {
  border-left-color: var(--park-color-highlight);
}

.module-banner :deep(.park-page-header__eyebrow) {
  color: var(--park-gold-bright, #f3d48a);
  letter-spacing: 0.32em;
  text-transform: none;
}

.module-banner :deep(h1) {
  color: #f8fbff;
  font-size: 32px;
  letter-spacing: 0.06em;
}

.module-banner :deep(.park-page-header__subtitle) {
  max-width: 720px;
  color: rgba(236, 244, 252, 0.82);
  line-height: 1.7;
}

@media (max-width: 760px) {
  .module-banner {
    flex-direction: column;
  }

  .module-banner :deep(h1) {
    font-size: 26px;
  }
}
</style>
