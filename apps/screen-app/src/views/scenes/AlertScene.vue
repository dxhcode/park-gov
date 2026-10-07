<script setup lang="ts">
import BarChart from '../../components/BarChart.vue'
import CockpitFrame from '../../components/CockpitFrame.vue'
import GlassPanel from '../../components/GlassPanel.vue'
import RingChart from '../../components/RingChart.vue'
import ScrollFeed from '../../components/ScrollFeed.vue'
import { alerts, levelRings, metricsOf, ownerBars, tickerOf } from '../../mock/dashboard'

const flow = [
  { label: '待核查', value: 2, display: '2 条' },
  { label: '处置中', value: 3, display: '3 条' },
  { label: '办理中', value: 2, display: '2 条' },
  { label: '其他', value: 3, display: '3 条' },
]
</script>

<template>
  <CockpitFrame
    :metrics="metricsOf('alerts')"
    :ticker="tickerOf('alerts')"
    caption="告警从风险画像、投诉时限和空间会商里摘出。列表循环滚动，鼠标悬停会停下。"
  >
    <div class="board">
      <GlassPanel title="实时告警" extra="10 条循环">
        <ScrollFeed :items="alerts" />
      </GlassPanel>
      <GlassPanel title="等级分布" extra="紧急优先">
        <RingChart :items="levelRings" center="10" caption="告警" />
      </GlassPanel>
      <GlassPanel title="责任去向" extra="三位承办人">
        <BarChart :items="ownerBars" />
      </GlassPanel>
      <GlassPanel title="闭环状态" extra="尚未归档">
        <BarChart :items="flow" />
      </GlassPanel>
    </div>
  </CockpitFrame>
</template>

<style scoped>
.board {
  display: grid;
  grid-template-columns: 1.25fr 0.85fr;
  grid-template-rows: minmax(220px, 1fr) minmax(180px, 0.8fr);
  gap: 12px;
  height: 100%;
}

.board > :first-child {
  grid-row: 1 / span 2;
}

@media (max-width: 980px) {
  .board {
    grid-template-columns: 1fr;
    grid-template-rows: none;
  }

  .board > :first-child {
    grid-row: auto;
    min-height: 280px;
  }
}
</style>
