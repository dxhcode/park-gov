<script setup lang="ts">
defineProps<{
  description: string
  actionLabel: string
  secondaryLabel?: string
}>()

defineEmits<{
  action: []
  secondary: []
}>()
</script>

<template>
  <div class="empty-state">
    <a-empty :description="description">
      <a-space>
        <a-button type="primary" @click="$emit('action')">{{ actionLabel }}</a-button>
        <a-button v-if="secondaryLabel" @click="$emit('secondary')">{{ secondaryLabel }}</a-button>
      </a-space>
    </a-empty>
  </div>
</template>

<style scoped>
.empty-state {
  padding: 28px 12px 8px;
}
</style>
