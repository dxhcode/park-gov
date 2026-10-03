<script setup lang="ts">
import KpiTicker from './KpiTicker.vue'
import MetricStrip from './MetricStrip.vue'
import type { Metric, TickerItem } from '../mock/dashboard'

defineProps<{
  metrics: Metric[]
  ticker: TickerItem[]
  caption: string
}>()
</script>

<template>
  <section class="cockpit">
    <MetricStrip :items="metrics" />
    <KpiTicker :items="ticker" />
    <p class="caption">{{ caption }}</p>
    <div class="stage">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.cockpit {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  min-height: 640px;
}

.caption {
  margin: 0;
  color: rgba(190, 226, 240, 0.72);
  font-size: 12px;
  letter-spacing: 0.08em;
}

.stage {
  flex: 1;
  min-height: 0;
}
</style>
