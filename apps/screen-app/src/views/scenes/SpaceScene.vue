<script setup lang="ts">
import { computed } from 'vue'
import BarChart from '../../components/BarChart.vue'
import CockpitFrame from '../../components/CockpitFrame.vue'
import GlassPanel from '../../components/GlassPanel.vue'
import ParcelMap from '../../components/ParcelMap.vue'
import { metricsOf, parcels, parkById, parkNodes, tickerOf } from '../../mock/dashboard'
import { useScreenStore } from '../../stores/screen'

const screen = useScreenStore()
const park = computed(() => parkById(screen.focusParkId))
const blocks = computed(() => parcels.filter((item) => item.parkId === park.value.id))
const occupancy = parkNodes.map((item) => ({
  label: item.shortName,
  value: Math.round(item.occupancy * 100),
  display: `${Math.round(item.occupancy * 100)}%`,
}))
const idleBars = parkNodes.map((item) => ({
  label: item.shortName,
  value: item.idleSqm,
  display: `${item.idleSqm.toLocaleString('zh-CN')} ㎡`,
}))
</script>

<template>
  <CockpitFrame
    :metrics="metricsOf('space')"
    :ticker="tickerOf('space')"
    caption="用地、用房和闲置铺在同一张载体图上。点选园区后，右侧只留该园斑块。"
  >
    <div class="board">
      <GlassPanel title="载体热力" extra="颜色越暖，闲置或临时利用越需要盯">
        <ParcelMap />
      </GlassPanel>
      <div class="side">
        <GlassPanel :title="`${park.shortName}斑块`" :extra="park.phone">
          <ul>
            <li v-for="block in blocks" :key="block.name">
              <strong>{{ block.name }}</strong>
              <em>{{ block.note }}</em>
            </li>
          </ul>
        </GlassPanel>
        <GlassPanel title="楼宇入住率" extra="六栋载体">
          <BarChart :items="occupancy" />
        </GlassPanel>
        <GlassPanel title="未盘活闲置" extra="不含已盘活仓储棚">
          <BarChart :items="idleBars" />
        </GlassPanel>
      </div>
    </div>
  </CockpitFrame>
</template>

<style scoped>
.board {
  display: grid;
  grid-template-columns: 1.45fr 0.8fr;
  gap: 12px;
  height: 100%;
}

.side {
  display: grid;
  grid-template-rows: 1.1fr 0.9fr 0.9fr;
  gap: 12px;
  min-height: 0;
}

ul {
  margin: 0;
  padding: 0;
  overflow: auto;
  list-style: none;
}

li {
  padding: 7px 0;
  border-bottom: 1px solid rgba(126, 235, 255, 0.1);
}

strong,
em {
  display: block;
}

strong {
  color: #f4fbff;
  font-size: 13px;
}

em {
  margin-top: 2px;
  color: rgba(190, 226, 240, 0.72);
  font-style: normal;
  font-size: 12px;
}

@media (max-width: 980px) {
  .board {
    grid-template-columns: 1fr;
  }
}
</style>
