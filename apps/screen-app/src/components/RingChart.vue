<script setup lang="ts">
import { computed } from 'vue'
import { ScreenChart } from '@park/components'
import type { RingItem } from '../mock/dashboard'

const props = defineProps<{
  items: RingItem[]
  center: string
  caption: string
}>()

const categories = computed(() => props.items.map((item) => item.label))
const series = computed(() => [{ name: props.caption, data: props.items.map((item) => item.value) }])
</script>

<template>
  <ScreenChart kind="donut" :label="`${caption} ${center}`" :unit="caption" :categories="categories" :series="series" />
</template>
