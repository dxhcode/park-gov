<script setup lang="ts">
import { GlassCard } from '@park/components'

defineProps<{
  title: string
  extra?: string
}>()
</script>

<template>
  <GlassCard class="screen-panel" :title="title" :glow="true">
    <template v-if="extra" #extra>{{ extra }}</template>
    <slot />
  </GlassCard>
</template>
