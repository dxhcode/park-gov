<script setup lang="ts">
import { computed } from 'vue'
import { ScreenChart } from '@park/components'
import type { Series } from '../mock/dashboard'

const props = defineProps<{
  labels: string[]
  series: Series[]
}>()

const chartSeries = computed(() => props.series.map((item) => ({ name: item.name, data: item.values })))
</script>

<template>
  <ScreenChart kind="line" label="月度产值折线" unit="亿元" :categories="labels" :series="chartSeries" />
</template>
