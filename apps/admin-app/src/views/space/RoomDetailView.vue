<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ModuleFrame from '../../components/ModuleFrame.vue'
import StatusTag from '../../components/StatusTag.vue'
import { buildingLabel, formatArea, formatRent, parkLabel } from '../../mock/lookups'
import { useRegistryStore } from '../../stores/registry'

const route = useRoute()
const router = useRouter()
const registry = useRegistryStore()

const id = computed(() => (typeof route.params.id === 'string' ? route.params.id : ''))
const record = computed(() => registry.roomById(id.value))
const tenant = computed(() =>
  record.value?.enterpriseId ? registry.enterpriseById(record.value.enterpriseId) : undefined,
)

function back() {
  void router.push({ name: 'space-building' })
}

function edit() {
  void router.push({ name: 'space-building-edit', params: { id: id.value } })
}
</script>

<template>
  <ModuleFrame eyebrow="空间监管" title="用房详情" hint="载体位置、承租关系与租期。">
    <template v-if="record" #extra>
      <a-button @click="back">返回用房</a-button>
      <a-button type="primary" @click="edit">编辑</a-button>
    </template>

    <a-result v-if="!record" status="404" title="未找到该用房" sub-title="记录不在本地台账中。">
      <template #extra>
        <a-button type="primary" @click="back">返回用房</a-button>
      </template>
    </a-result>

    <a-card v-else class="panel" :bordered="false">
      <div class="title-row">
        <h2>{{ record.name }}</h2>
        <StatusTag :value="record.status" />
      </div>
      <a-descriptions bordered :column="{ xs: 1, md: 2 }">
        <a-descriptions-item label="所在园区">{{ parkLabel(record.parkId) }}</a-descriptions-item>
        <a-descriptions-item label="所在楼宇">{{ buildingLabel(record.buildingId) }}</a-descriptions-item>
        <a-descriptions-item label="楼层">{{ record.floor }}</a-descriptions-item>
        <a-descriptions-item label="建筑面积">{{ formatArea(record.areaSqm) }}</a-descriptions-item>
        <a-descriptions-item label="用途">{{ record.usage }}</a-descriptions-item>
        <a-descriptions-item label="租金">{{ formatRent(record.rentYuan) }}</a-descriptions-item>
        <a-descriptions-item label="租期起">{{ record.leaseStart || '—' }}</a-descriptions-item>
        <a-descriptions-item label="租期止">{{ record.leaseEnd || '—' }}</a-descriptions-item>
        <a-descriptions-item label="承租企业" :span="2">
          <a
            v-if="tenant"
            @click.prevent="router.push({ name: 'enterprise-directory-detail', params: { id: tenant.id } })"
          >
            {{ tenant.name }}
          </a>
          <span v-else>暂无承租</span>
        </a-descriptions-item>
        <a-descriptions-item label="备注" :span="2">{{ record.note || '—' }}</a-descriptions-item>
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
