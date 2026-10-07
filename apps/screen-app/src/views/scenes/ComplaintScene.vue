<script setup lang="ts">
import BarChart from '../../components/BarChart.vue'
import CockpitFrame from '../../components/CockpitFrame.vue'
import GlassPanel from '../../components/GlassPanel.vue'
import ParkMap from '../../components/ParkMap.vue'
import RingChart from '../../components/RingChart.vue'
import ScrollFeed from '../../components/ScrollFeed.vue'
import { complaintFeed, complaintStatus, complaintTypes, metricsOf, parkNodes, tickerOf } from '../../mock/dashboard'

const heatBars = parkNodes.map((item) => ({
  label: item.shortName,
  value: item.complaints,
  display: `${item.complaints} 件`,
}))
</script>

<template>
  <CockpitFrame
    :metrics="metricsOf('complaint-heat')"
    :ticker="tickerOf('complaint-heat')"
    caption="投诉热力按园区件数铺开。临港三件叠在一起，圆斑最大。电话和姓名都是虚构的。"
  >
    <div class="board">
      <GlassPanel title="受理热力" extra="点园区看摘要">
        <ParkMap mode="complaint" />
      </GlassPanel>
      <GlassPanel title="类型结构" extra="8 件">
        <RingChart :items="complaintTypes" center="8" caption="受理" />
      </GlassPanel>
      <GlassPanel title="超时与临期" extra="按办结时限">
        <ScrollFeed :items="complaintFeed" />
      </GlassPanel>
      <GlassPanel title="办理状态" extra="已办结 3 件">
        <BarChart :items="complaintStatus" />
      </GlassPanel>
      <GlassPanel title="园区热度" extra="含已办结">
        <BarChart :items="heatBars" />
      </GlassPanel>
    </div>
  </CockpitFrame>
</template>

<style scoped>
.board {
  display: grid;
  grid-template-columns: 1.2fr 0.9fr 0.9fr;
  grid-template-rows: minmax(240px, 1.15fr) minmax(180px, 0.85fr);
  gap: 12px;
  height: 100%;
}

.board > :first-child {
  grid-row: 1 / span 2;
}

@media (max-width: 1100px) {
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
