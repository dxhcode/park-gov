<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const title = computed(() => route.meta.title)
const hint = computed(() => route.meta.hint)
const slots = computed(() => route.meta.slots)
</script>

<template>
  <section class="page">
    <header class="page-head">
      <div>
        <p class="eyebrow">业务模块</p>
        <h1>{{ title }}</h1>
        <p class="hint">{{ hint }}</p>
      </div>
      <div class="head-side">
        <a-tag color="gold">路由占位</a-tag>
        <code>{{ route.path }}</code>
      </div>
    </header>

    <a-row :gutter="[16, 16]">
      <a-col v-for="(slot, index) in slots" :key="slot" :xs="24" :md="8">
        <a-card class="slot-card" :bordered="false">
          <p class="idx">0{{ index + 1 }}</p>
          <h2>{{ slot }}</h2>
          <p class="pending">待接入</p>
        </a-card>
      </a-col>
    </a-row>

    <a-card class="empty-panel" :bordered="false">
      <a-empty description="本页只保留导航与版式。名录、地图、图表和接口将在后续阶段接入。" />
    </a-card>
  </section>
</template>

<style scoped>
.page {
  max-width: 1180px;
}

.page-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
  padding: 22px 24px;
  background:
    linear-gradient(120deg, rgba(12, 79, 138, 0.96), rgba(18, 48, 84, 0.92) 58%, rgba(28, 58, 42, 0.88)),
    #0c4f8a;
  border-radius: 16px;
  box-shadow: 0 16px 40px rgba(12, 40, 72, 0.16);
}

.eyebrow {
  margin: 0 0 8px;
  color: #f0d48a;
  font-size: 12px;
  letter-spacing: 0.32em;
}

h1 {
  margin: 0;
  color: #f8fbff;
  font-size: 32px;
  letter-spacing: 0.06em;
}

.hint {
  max-width: 680px;
  margin: 10px 0 0;
  color: rgba(236, 244, 252, 0.82);
  line-height: 1.7;
}

.head-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.head-side code {
  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
}

.slot-card {
  min-height: 148px;
  background: linear-gradient(180deg, #ffffff, #f7fafc);
  border: 1px solid rgba(16, 52, 92, 0.06);
  border-radius: 14px;
  box-shadow: 0 12px 28px rgba(18, 46, 82, 0.05);
}

.slot-card :deep(.ant-card-body) {
  padding: 18px 18px 16px;
}

.idx {
  margin: 0;
  color: #c4a15a;
  font-size: 12px;
  letter-spacing: 0.18em;
}

h2 {
  margin: 10px 0 18px;
  color: #17324d;
  font-size: 18px;
}

.pending {
  margin: 0;
  color: #8ea3b8;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.empty-panel {
  margin-top: 16px;
  border: 1px dashed rgba(12, 79, 138, 0.28);
  border-radius: 14px;
}

@media (max-width: 760px) {
  .page-head {
    flex-direction: column;
  }

  .head-side {
    align-items: flex-start;
  }

  h1 {
    font-size: 26px;
  }
}
</style>
