<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ModuleFrame from '../../components/ModuleFrame.vue'
import StatusTag from '../../components/StatusTag.vue'
import { buildingLabel, idleDays, parkLabel } from '../../mock/lookups'
import { useRegistryStore } from '../../stores/registry'

const route = useRoute()
const router = useRouter()
const registry = useRegistryStore()

const id = computed(() => (typeof route.params.id === 'string' ? route.params.id : ''))
const record = computed(() => registry.idleById(id.value))
const days = computed(() => (record.value ? idleDays(record.value.idleSince) : 0))
const overdue = computed(() => Boolean(record.value && record.value.reviveStatus !== '已盘活' && days.value >= 365))

function back() {
  void router.push({ name: 'space-idle' })
}

function edit() {
  void router.push({ name: 'space-idle-edit', params: { id: id.value } })
}
</script>

<template>
  <ModuleFrame eyebrow="空间监管" title="闲置详情" hint="闲置原因、闲置时长和当前盘活路径。">
    <template v-if="record" #extra>
      <a-button @click="back">返回闲置</a-button>
      <a-button type="primary" @click="edit">编辑</a-button>
    </template>

    <a-result v-if="!record" status="404" title="未找到该闲置记录" sub-title="记录不在本地台账中。">
      <template #extra>
        <a-button type="primary" @click="back">返回闲置</a-button>
      </template>
    </a-result>

    <a-card v-else class="panel" :bordered="false">
      <div class="title-row">
        <h2>{{ record.name }}</h2>
        <StatusTag :value="record.reviveStatus" />
        <a-tag v-if="overdue" color="red">闲置满一年</a-tag>
      </div>
      <a-descriptions bordered :column="{ xs: 1, md: 2 }">
        <a-descriptions-item label="类型">{{ record.kind }}</a-descriptions-item>
        <a-descriptions-item label="面积">{{ record.areaNote }}</a-descriptions-item>
        <a-descriptions-item label="所在园区">{{ parkLabel(record.parkId) }}</a-descriptions-item>
        <a-descriptions-item label="关联楼宇">{{ buildingLabel(record.buildingId) }}</a-descriptions-item>
        <a-descriptions-item label="闲置起始">{{ record.idleSince }}</a-descriptions-item>
        <a-descriptions-item label="闲置天数">{{ days }} 天</a-descriptions-item>
        <a-descriptions-item label="联系人">{{ record.contact }}</a-descriptions-item>
        <a-descriptions-item label="联系电话">{{ record.phone }}</a-descriptions-item>
        <a-descriptions-item label="闲置原因" :span="2">{{ record.reason }}</a-descriptions-item>
        <a-descriptions-item label="盘活路径" :span="2">{{ record.plan }}</a-descriptions-item>
      </a-descriptions>
    </a-card>
  </ModuleFrame>
</template>

<style scoped>
.panel {
  border-radius: 14px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

h2 {
  margin: 0;
  color: #17324d;
  font-size: 22px;
}
</style>
