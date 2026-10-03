<script setup lang="ts">
import { computed } from 'vue'
import BarChart from '../../components/BarChart.vue'
import CockpitFrame from '../../components/CockpitFrame.vue'
import GlassPanel from '../../components/GlassPanel.vue'
import LineChart from '../../components/LineChart.vue'
import ParkMap from '../../components/ParkMap.vue'
import ScrollFeed from '../../components/ScrollFeed.vue'
import { alerts, metricsOf, outputLabels, outputSeries, parkById, parkNodes, spotlight, tickerOf } from '../../mock/dashboard'
import { useScreenStore } from '../../stores/screen'

const screen = useScreenStore()
const park = computed(() => parkById(screen.focusParkId))
const enterpriseBars = parkNodes.map((item) => ({
  label: item.shortName,
  value: item.enterprises,
  display: `${item.inPark} 在园`,
}))
</script>

<template>
  <CockpitFrame
    :metrics="metricsOf('overview')"
    :ticker="tickerOf('overview')"
    caption="三园产值、企业和告警同屏。点地图上的园区，右侧换成该园摘要。"
  >
    <div class="board">
      <GlassPanel class="map" title="空间底图" extra="热力随风险与投诉">
        <ParkMap />
      </GlassPanel>
      <GlassPanel title="月度产值" extra="亿元 · 虚构">
        <LineChart :labels="outputLabels" :series="outputSeries" />
      </GlassPanel>
      <GlassPanel title="告警流" extra="演示队列">
        <ScrollFeed :items="alerts" />
      </GlassPanel>
      <GlassPanel :title="park.shortName" :extra="park.city">
        <div class="dossier">
          <p>{{ park.brief }}</p>
          <ul>
            <li><span>值班电话</span><strong>{{ park.phone }}</strong></li>
            <li><span>规上产值</span><strong>{{ park.outputYi.toFixed(1) }} 亿元</strong></li>
            <li><span>在园 / 在册</span><strong>{{ park.inPark }} / {{ park.enterprises }}</strong></li>
            <li><span>高风险</span><strong>{{ park.highRisk }}</strong></li>
            <li><span>未盘活闲置</span><strong>{{ park.idleSqm.toLocaleString('zh-CN') }} ㎡</strong></li>
            <li><span>投诉</span><strong>{{ park.complaints }} 件</strong></li>
          </ul>
        </div>
      </GlassPanel>
      <GlassPanel title="在册企业" extra="按园区">
        <BarChart :items="enterpriseBars" />
      </GlassPanel>
      <GlassPanel title="重点企业" extra="信用代码虚构">
        <ul class="firms">
          <li v-for="firm in spotlight" :key="firm.creditCode">
            <div>
              <strong>{{ firm.name }}</strong>
              <em>{{ firm.creditCode }} · {{ firm.phone }}</em>
            </div>
            <b>{{ firm.tag }}</b>
          </li>
        </ul>
      </GlassPanel>
    </div>
  </CockpitFrame>
</template>

<style scoped>
.board {
  display: grid;
  grid-template-columns: 1.15fr 0.95fr 0.9fr;
  grid-template-rows: minmax(240px, 1.15fr) minmax(180px, 0.85fr);
  gap: 12px;
  height: 100%;
}

.map {
  grid-row: 1 / span 2;
}

.dossier p {
  margin: 0 0 8px;
  color: rgba(226, 242, 252, 0.82);
  font-size: 13px;
  line-height: 1.6;
}

.dossier ul,
.firms {
  margin: 0;
  padding: 0;
  list-style: none;
}

.dossier li,
.firms li {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 4px 0;
  border-bottom: 1px solid rgba(126, 235, 255, 0.1);
}

.dossier span,
.firms em {
  color: rgba(190, 226, 240, 0.7);
  font-style: normal;
  font-size: 12px;
}

.dossier strong,
.firms strong {
  color: #f4fbff;
  font-size: 13px;
}

.firms {
  overflow: auto;
}

.firms li {
  align-items: center;
  padding: 7px 0;
}

.firms em {
  display: block;
  margin-top: 2px;
}

.firms b {
  flex: none;
  color: #f3d48a;
  font-size: 12px;
  letter-spacing: 0.08em;
}

@media (max-width: 1100px) {
  .board {
    grid-template-columns: 1fr;
    grid-template-rows: none;
  }

  .map {
    grid-row: auto;
    min-height: 280px;
  }
}
</style>
