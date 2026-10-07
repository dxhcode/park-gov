<script setup lang="ts">
import AdminJump from '../../components/AdminJump.vue'
import BarChart from '../../components/BarChart.vue'
import CockpitFrame from '../../components/CockpitFrame.vue'
import GlassPanel from '../../components/GlassPanel.vue'
import RingChart from '../../components/RingChart.vue'
import { closureBars, industryBars, metricsOf, riskCards, riskRings, tickerOf } from '../../mock/dashboard'

const scoreBars = riskCards.map((item) => ({
  label: item.name.replace(/有限公司|股份有限公司/g, ''),
  value: item.score,
  display: `${item.score} 分`,
}))
</script>

<template>
  <CockpitFrame
    :metrics="metricsOf('enterprise-risk')"
    :ticker="tickerOf('enterprise-risk')"
    caption="风险等级、行业和处置闭环。信用代码、电话与管理端画像一致，分数是演示值。"
  >
    <div class="board">
      <GlassPanel title="风险等级" extra="8 条画像">
        <RingChart :items="riskRings" center="8" caption="画像" />
      </GlassPanel>
      <GlassPanel title="重点信号" extra="点名称进档案">
        <ul>
          <li v-for="card in riskCards" :key="card.creditCode">
            <div>
              <AdminJump :path="`/enterprise/directory/${card.enterpriseId}`">
                <strong>{{ card.name }}</strong>
              </AdminJump>
              <em>{{ card.signal }} · {{ card.creditCode }}</em>
            </div>
            <b :class="{ hot: card.level === '高风险' }">{{ card.level }} {{ card.score }}</b>
          </li>
        </ul>
      </GlassPanel>
      <GlassPanel title="行业分布" extra="有信号的企业">
        <BarChart :items="industryBars" />
      </GlassPanel>
      <GlassPanel title="处置闭环" extra="待核查优先">
        <BarChart :items="closureBars" />
      </GlassPanel>
      <GlassPanel title="风险分" extra="满分 100">
        <BarChart :items="scoreBars" />
      </GlassPanel>
    </div>
  </CockpitFrame>
</template>

<style scoped>
.board {
  display: grid;
  grid-template-columns: 0.9fr 1.2fr;
  grid-template-rows: minmax(220px, 1fr) minmax(180px, 0.85fr) minmax(180px, 0.85fr);
  gap: 12px;
  height: 100%;
}

.board > :nth-child(2) {
  grid-row: 1 / span 3;
}

ul {
  margin: 0;
  padding: 0;
  overflow: auto;
  list-style: none;
}

li {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
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

:deep(.admin-jump:hover strong) {
  color: var(--park-gold-bright, #f3d48a);
}

em {
  margin-top: 2px;
  color: rgba(190, 226, 240, 0.7);
  font-style: normal;
  font-size: 12px;
}

b {
  flex: none;
  color: #f3d48a;
  font-size: 12px;
  letter-spacing: 0.06em;
}

.hot {
  color: #ffb4c2;
}

@media (max-width: 980px) {
  .board {
    grid-template-columns: 1fr;
    grid-template-rows: none;
  }

  .board > :nth-child(2) {
    grid-row: auto;
  }
}
</style>
