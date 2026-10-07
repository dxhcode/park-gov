<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue'
import type { TableColumnsType } from 'ant-design-vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { EmptyState } from '@park/components'
import ScreenLink from '../../components/ScreenLink.vue'
import ModuleFrame from '../../components/ModuleFrame.vue'
import StatRow from '../../components/StatRow.vue'
import StatusTag from '../../components/StatusTag.vue'
import { buildingLabel, formatArea, formatRent, matchesKeyword, parkLabel } from '../../mock/lookups'
import { parks } from '../../mock/parks'
import { roomStatuses, type RoomStatus, type SpaceRoom } from '../../mock/types'
import { useRegistryStore } from '../../stores/registry'

const router = useRouter()
const registry = useRegistryStore()

const keyword = ref('')
const parkId = ref<string>()
const status = ref<RoomStatus>()

const rows = computed(() =>
  registry.state.rooms.filter((item) => {
    if (parkId.value && item.parkId !== parkId.value) return false
    if (status.value && item.status !== status.value) return false
    const tenant = item.enterpriseId ? registry.enterpriseById(item.enterpriseId)?.name ?? '' : ''
    return matchesKeyword(keyword.value, [item.name, item.usage, item.floor, tenant])
  }),
)

const stats = computed(() => {
  const all = registry.state.rooms
  const area = all.reduce((sum, item) => sum + item.areaSqm, 0)
  return [
    { label: '载体用房', value: all.length, hint: '房号与整跨' },
    { label: '在用', value: all.filter((item) => item.status === '在用').length, hint: '已承租' },
    { label: '空置待租', value: all.filter((item) => item.status === '空置待租').length, hint: '可投放' },
    { label: '在册面积', value: area.toLocaleString('zh-CN'), hint: '平方米' },
  ]
})

const columns: TableColumnsType<SpaceRoom> = [
  { title: '载体', dataIndex: 'name', key: 'name' },
  { title: '园区', key: 'park', width: 120 },
  { title: '楼宇', key: 'building', width: 140 },
  { title: '面积', key: 'area', width: 120 },
  { title: '用途', dataIndex: 'usage', width: 90 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 110 },
  { title: '承租企业', key: 'tenant', ellipsis: true },
  { title: '租金', key: 'rent', width: 140 },
  { title: '操作', key: 'action', width: 140 },
]

function tenantName(id: string | null) {
  if (!id) return '—'
  return registry.enterpriseById(id)?.name ?? '—'
}

function openDetail(id: string) {
  void router.push({ name: 'space-building-detail', params: { id } })
}

function clearFilters() {
  keyword.value = ''
  parkId.value = undefined
  status.value = undefined
}

function openEdit(id: string) {
  void router.push({ name: 'space-building-edit', params: { id } })
}

const pagination = {
  pageSize: 8,
  showTotal: (total: number) => `共 ${total} 条`,
}
</script>

<template>
  <ModuleFrame
    eyebrow="空间监管"
    title="用房"
    hint="厂房、楼宇与载体的使用和承租情况。可按园区和状态筛选，新建与修改保存在本机。"
  >
    <template #extra>
      <ScreenLink scene="/space" label="空间态势大屏" />
      <a-button type="primary" ghost @click="router.push({ name: 'space-building-create' })">
        <PlusOutlined />
        新建用房
      </a-button>
    </template>

    <StatRow :items="stats" />

    <a-card class="panel" :bordered="false">
      <div class="filters">
        <a-input-search v-model:value="keyword" allow-clear placeholder="搜索房号、用途、楼层或承租企业" />
        <a-select
          v-model:value="parkId"
          allow-clear
          placeholder="全部园区"
          :options="parks.map((item) => ({ value: item.id, label: item.shortName }))"
        />
        <a-select
          v-model:value="status"
          allow-clear
          placeholder="全部状态"
          :options="roomStatuses.map((item) => ({ value: item, label: item }))"
        />
      </div>
      <EmptyState
        v-if="rows.length === 0"
        variant="search"
        title="没有符合条件的用房"
        description="换一个条件，或清空筛选后再查。"
        primary-text="清空筛选"
        secondary-text="新建用房"
        @primary="clearFilters"
        @secondary="router.push({ name: 'space-building-create' })"
      />
      <a-table
        v-else
        :columns="columns"
        :data-source="rows"
        :pagination="pagination"
        row-key="id"
        :scroll="{ x: 1080 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <a @click.prevent="openDetail(record.id)">{{ record.name }}</a>
          </template>
          <template v-else-if="column.key === 'park'">{{ parkLabel(record.parkId) }}</template>
          <template v-else-if="column.key === 'building'">{{ buildingLabel(record.buildingId) }}</template>
          <template v-else-if="column.key === 'area'">{{ formatArea(record.areaSqm) }}</template>
          <template v-else-if="column.key === 'status'">
            <StatusTag :value="record.status" />
          </template>
          <template v-else-if="column.key === 'tenant'">{{ tenantName(record.enterpriseId) }}</template>
          <template v-else-if="column.key === 'rent'">{{ formatRent(record.rentYuan) }}</template>
          <template v-else-if="column.key === 'action'">
            <a-button type="link" @click="openDetail(record.id)">详情</a-button>
            <a-button type="link" @click="openEdit(record.id)">编辑</a-button>
          </template>
        </template>
      </a-table>
    </a-card>
  </ModuleFrame>
</template>

<style scoped>
.panel {
  border-radius: 14px;
  box-shadow: 0 12px 28px rgba(18, 46, 82, 0.05);
}

.filters {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) 180px 160px;
  gap: 12px;
  margin-bottom: 16px;
}

@media (max-width: 800px) {
  .filters {
    grid-template-columns: 1fr;
  }
}
</style>
