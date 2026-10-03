<script setup lang="ts">
import BarChart from '../../components/BarChart.vue'
import CockpitFrame from '../../components/CockpitFrame.vue'
import GlassPanel from '../../components/GlassPanel.vue'
import RingChart from '../../components/RingChart.vue'
import ScrollFeed from '../../components/ScrollFeed.vue'
import { categoryRings, metricsOf, scoreRows, shortfalls, tickerOf } from '../../mock/dashboard'

const scoreBars = [
  { label: '政策兑现', value: 91 },
  { label: '载体出租', value: 88 },
  { label: '投资到位', value: 84 },
  { label: '手续完备', value: 81 },
  { label: '投诉办结', value: 76 },
]
</script>

<template>
  <CockpitFrame
    :metrics="metricsOf('assessment')"
    :ticker="tickerOf('assessment')"
    caption="只展示已经评分或归档的分数。未开始和填报中的三项记 0，放在短板清单里。"
  >
    <div class="board">
      <GlassPanel title="已出分" extra="按样例得分">
        <BarChart :items="scoreBars" />
        <ul>
          <li v-for="row in scoreRows" :key="row.name">
            <span>{{ row.park }} · {{ row.category }}</span>
            <strong>{{ row.name }}</strong>
            <em>{{ row.progress }} {{ row.score }} 分</em>
          </li>
        </ul>
      </GlassPanel>
      <GlassPanel title="指标结构" extra="八项按四类">
        <RingChart :items="categoryRings" center="8" caption="指标" />
      </GlassPanel>
      <GlassPanel title="短板项" extra="得分记 0">
        <ScrollFeed :items="shortfalls" />
      </GlassPanel>
      <GlassPanel title="归档口径" extra="不改管理端台账">
        <p>已归档的三项不再改分：云栖政策兑现 91、光谷手续完备率 81、临港制造业投资 84。</p>
        <p>已评分待归档的是云栖载体出租率 88、临港投诉办结率 76。安全类两项和云栖招商项仍是 0 分。</p>
      </GlassPanel>
    </div>
  </CockpitFrame>
</template>

<style scoped>
.board {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  grid-template-rows: minmax(260px, 1.2fr) minmax(180px, 0.8fr);
  gap: 12px;
  height: 100%;
}

.board > :first-child {
  grid-row: 1 / span 2;
}

ul {
  margin: 10px 0 0;
  padding: 0;
  list-style: none;
}

li {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr) auto;
  gap: 8px;
  padding: 6px 0;
  border-top: 1px solid rgba(126, 235, 255, 0.1);
  font-size: 12px;
}

span,
em {
  color: rgba(190, 226, 240, 0.72);
  font-style: normal;
}

strong {
  color: #f4fbff;
}

p {
  margin: 0 0 10px;
  color: rgba(226, 242, 252, 0.82);
  font-size: 13px;
  line-height: 1.7;
}

@media (max-width: 980px) {
  .board {
    grid-template-columns: 1fr;
    grid-template-rows: none;
  }

  .board > :first-child {
    grid-row: auto;
  }

  li {
    grid-template-columns: 1fr;
  }
}
</style>
