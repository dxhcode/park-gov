<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue'
import type { TableColumnsType } from 'ant-design-vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import EmptyState from '../../components/EmptyState.vue'
import ModuleFrame from '../../components/ModuleFrame.vue'
import StatRow from '../../components/StatRow.vue'
import StatusTag from '../../components/StatusTag.vue'
import { idleDays, matchesKeyword, parkLabel } from '../../mock/lookups'
import { parks } from '../../mock/parks'
import { idleKinds, reviveStatuses, type IdleAsset, type IdleKind, type ReviveStatus } from '../../mock/types'
import { useRegistryStore } from '../../stores/registry'

const router = useRouter()
const registry = useRegistryStore()

const keyword = ref('')
const parkId = ref<string>()
const kind = ref<IdleKind>()
const reviveStatus = ref<ReviveStatus>()

const rows = computed(() =>
  registry.state.idles.filter((item) => {
    if (parkId.value && item.parkId !== parkId.value) return false
    if (kind.value && item.kind !== kind.value) return false
    if (reviveStatus.value && item.reviveStatus !== reviveStatus.value) return false
    return matchesKeyword(keyword.value, [item.name, item.reason, item.plan, item.contact])
  }),
)

const stats = computed(() => {
  const all = registry.state.idles
  const open = all.filter((item) => item.reviveStatus !== '已盘活')
  const overdue = open.filter((item) => idleDays(item.idleSince) >= 365)
  return [
    { label: '闲置条目', value: all.length, hint: '厂房、楼层、用地' },
    { label: '待盘活', value: all.filter((item) => item.reviveStatus === '待盘活').length, hint: '尚未对接' },
    { label: '洽谈中', value: all.filter((item) => item.reviveStatus === '洽谈中').length, hint: '已有意向' },
    { label: '闲置满一年', value: overdue.length, hint: '未盘活且超过 365 天' },
  ]
})

const columns: TableColumnsType<IdleAsset> = [
  { title: '名称', dataIndex: 'name', key: 'name', ellipsis: true },
  { title: '类型', dataIndex: 'kind', width: 110 },
  { title: '园区', key: 'park', width: 120 },
  { title: '面积', dataIndex: 'areaNote', width: 110 },
  { title: '闲置起始', dataIndex: 'idleSince', width: 120 },
  { title: '闲置天数', key: 'days', width: 110 },
  { title: '盘活状态', dataIndex: 'reviveStatus', key: 'reviveStatus', width: 110 },
  { title: '操作', key: 'action', width: 140 },
]

function openDetail(id: string) {
  void router.push({ name: 'space-idle-detail', params: { id } })
}

function openEdit(id: string) {
  void router.push({ name: 'space-idle-edit', params: { id } })
}

function clearFilters() {
  keyword.value = ''
  parkId.value = undefined
  kind.value = undefined
  reviveStatus.value = undefined
}

const pagination = {
  pageSize: 8,
  showTotal: (total: number) => `共 ${total} 条`,
}
</script>

<template>
  <ModuleFrame
    eyebrow="空间监管"
    title="闲置"
    hint="闲置用地、闲置厂房和闲置楼层的发现与盘活跟踪。超过一年且尚未盘活的条目会标出。"
  >
    <template #extra>
      <a-button type="primary" ghost @click="router.push({ name: 'space-idle-create' })">
        <PlusOutlined />
        新建闲置
      </a-button>
    </template>

    <StatRow :items="stats" />

    <a-card class="panel" :bordered="false">
      <div class="filters">
        <a-input-search v-model:value="keyword" allow-clear placeholder="搜索名称、原因、盘活路径或联系人" />
        <a-select
          v-model:value="parkId"
          allow-clear
          placeholder="全部园区"
          :options="parks.map((item) => ({ value: item.id, label: item.shortName }))"
        />
        <a-select
          v-model:value="kind"
          allow-clear
          placeholder="全部类型"
          :options="idleKinds.map((item) => ({ value: item, label: item }))"
        />
        <a-select
          v-model:value="reviveStatus"
          allow-clear
          placeholder="全部盘活状态"
          :options="reviveStatuses.map((item) => ({ value: item, label: item }))"
        />
      </div>
      <EmptyState
        v-if="rows.length === 0"
        description="没有符合条件的闲置记录。"
        action-label="清空筛选"
        secondary-label="新建闲置"
        @action="clearFilters"
        @secondary="router.push({ name: 'space-idle-create' })"
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
          <template v-else-if="column.key === 'days'">
            <span :class="{ overdue: record.reviveStatus !== '已盘活' && idleDays(record.idleSince) >= 365 }">
              {{ idleDays(record.idleSince) }} 天
            </span>
          </template>
          <template v-else-if="column.key === 'reviveStatus'">
            <StatusTag :value="record.reviveStatus" />
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
  grid-template-columns: minmax(220px, 1fr) 160px 150px 160px;
  gap: 12px;
  margin-bottom: 16px;
}

.overdue {
  color: #a61b1b;
  font-weight: 700;
}

@media (max-width: 900px) {
  .filters {
    grid-template-columns: 1fr;
  }
}
</style>
