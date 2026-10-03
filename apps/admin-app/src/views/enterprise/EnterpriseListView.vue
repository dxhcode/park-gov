<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue'
import type { TableColumnsType } from 'ant-design-vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import EmptyState from '../../components/EmptyState.vue'
import ScreenLink from '../../components/ScreenLink.vue'
import ModuleFrame from '../../components/ModuleFrame.vue'
import StatRow from '../../components/StatRow.vue'
import StatusTag from '../../components/StatusTag.vue'
import { buildingLabel, matchesKeyword, parkLabel } from '../../mock/lookups'
import { parks } from '../../mock/parks'
import { enterpriseStatuses, type Enterprise, type EnterpriseStatus } from '../../mock/types'
import { useRegistryStore } from '../../stores/registry'

const router = useRouter()
const registry = useRegistryStore()

const keyword = ref('')
const parkId = ref<string>()
const status = ref<EnterpriseStatus>()

const rows = computed(() =>
  registry.state.enterprises.filter((item) => {
    if (parkId.value && item.parkId !== parkId.value) return false
    if (status.value && item.status !== status.value) return false
    return matchesKeyword(keyword.value, [item.name, item.creditCode, item.contact, item.industry])
  }),
)

const stats = computed(() => {
  const all = registry.state.enterprises
  return [
    { label: '在册企业', value: all.length, hint: '含已迁出档案' },
    { label: '在园', value: all.filter((item) => item.status === '在园').length, hint: '正常监管' },
    { label: '待入驻', value: all.filter((item) => item.status === '待入驻').length, hint: '手续未齐' },
    { label: '已迁出', value: all.filter((item) => item.status === '已迁出').length, hint: '档案保留' },
  ]
})

const columns: TableColumnsType<Enterprise> = [
  { title: '企业名称', dataIndex: 'name', key: 'name', ellipsis: true },
  { title: '统一社会信用代码', dataIndex: 'creditCode', key: 'creditCode', width: 210 },
  { title: '园区', key: 'park', width: 120 },
  { title: '楼宇', key: 'building', width: 140 },
  { title: '行业', dataIndex: 'industry', width: 110 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '入驻日期', dataIndex: 'settledAt', width: 120 },
  { title: '操作', key: 'action', width: 140 },
]

function openDetail(id: string) {
  void router.push({ name: 'enterprise-directory-detail', params: { id } })
}

function openEdit(id: string) {
  void router.push({ name: 'enterprise-directory-edit', params: { id } })
}

function clearFilters() {
  keyword.value = ''
  parkId.value = undefined
  status.value = undefined
}

const pagination = {
  pageSize: 8,
  showTotal: (total: number) => `共 ${total} 条`,
}
</script>

<template>
  <ModuleFrame
    eyebrow="企业监管"
    title="企业名录"
    hint="在园企业主体、统一社会信用代码与入驻状态。样例可查询、查看和修改，结果只保存在本机浏览器。"
  >
    <template #extra>
      <ScreenLink scene="/enterprise-risk" label="企业风险大屏" />
      <a-button type="primary" ghost @click="router.push({ name: 'enterprise-directory-create' })">
        <PlusOutlined />
        新建企业
      </a-button>
    </template>

    <StatRow :items="stats" />

    <a-card class="panel" :bordered="false">
      <div class="filters">
        <a-input-search v-model:value="keyword" allow-clear placeholder="搜索名称、信用代码、联系人或行业" />
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
          :options="enterpriseStatuses.map((item) => ({ value: item, label: item }))"
        />
      </div>
      <EmptyState
        v-if="rows.length === 0"
        description="没有符合条件的企业。"
        action-label="清空筛选"
        secondary-label="新建企业"
        @action="clearFilters"
        @secondary="router.push({ name: 'enterprise-directory-create' })"
      />
      <a-table
        v-else
        :columns="columns"
        :data-source="rows"
        :pagination="pagination"
        row-key="id"
        :scroll="{ x: 980 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <a @click.prevent="openDetail(record.id)">{{ record.name }}</a>
          </template>
          <template v-else-if="column.key === 'park'">{{ parkLabel(record.parkId) }}</template>
          <template v-else-if="column.key === 'building'">{{ buildingLabel(record.buildingId) }}</template>
          <template v-else-if="column.key === 'status'">
            <StatusTag :value="record.status" />
          </template>
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
