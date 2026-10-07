<script setup lang="ts">
import { computed } from 'vue'
import { KpiTicker as ParkKpiTicker } from '@park/components'
import type { TickerItem as ParkTickerItem } from '@park/components'
import type { TickerItem } from '../mock/dashboard'

const props = defineProps<{
  items: TickerItem[]
}>()

const ticker = computed<ParkTickerItem[]>(() =>
  props.items.map((item, index) => ({
    id: `${item.label}-${index}`,
    label: item.label,
    value: item.value,
    level: '指标',
  })),
)
</script>

<template>
  <ParkKpiTicker :items="ticker" label="指标滚动条" />
</template>
