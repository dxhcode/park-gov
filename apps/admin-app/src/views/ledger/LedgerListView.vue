<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue'
import type { TableColumnsType } from 'ant-design-vue'
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EmptyState from '../../components/EmptyState.vue'
import ModuleFrame from '../../components/ModuleFrame.vue'
import StatRow from '../../components/StatRow.vue'
import StatusTag from '../../components/StatusTag.vue'
import { formatLedgerValue } from '../../ledger/format'
import { ledgerByKey } from '../../ledger/modules'
import type { LedgerField, LedgerRecord } from '../../ledger/types'
import { matchesKeyword, parkLabel } from '../../mock/lookups'
import { parks } from '../../mock/parks'
import { useAffairsStore } from '../../stores/affairs'
import { useRegistryStore } from '../../stores/registry'

const route = useRoute()
const router = useRouter()
const affairs = useAffairsStore()
const registry = useRegistryStore()

const mod = computed(() => ledgerByKey(String(route.meta.ledger ?? '')) ?? null)
const keyword = ref('')
const filters = reactive<Record<string, string | undefined>>({})

const filterFields = computed(() => mod.value?.fields.filter((item) => item.filter) ?? [])

function enterpriseName(id: string) {
  return registry.enterpriseById(id)?.name ?? ''
}

function show(field: LedgerField | undefined, record: LedgerRecord) {
  const name = field?.kind === 'enterprise' ? enterpriseName(String(record[field.key] ?? '')) : undefined
  return formatLedgerValue(field, record, name)
}

const source = computed(() => {
  const current = mod.value
  if (!current) return []
  return affairs.state[current.bucket]
})

const rows = computed(() => {
  const current = mod.value
  if (!current) return []
  return source.value.filter((record) => {
    for (const field of filterFields.value) {
      const selected = filters[field.key]
      if (selected && String(record[field.key]) !== selected) return false
    }
    const blob = current.searchKeys.map((key) => {
      const field = current.fields.find((item) => item.key === key)
      if (field?.kind === 'enterprise') return enterpriseName(String(record[key] ?? ''))
      if (field?.kind === 'park') return `${parkLabel(String(record[key] ?? ''))} ${record[key] ?? ''}`
      return String(record[key] ?? '')
    })
    return matchesKeyword(keyword.value, blob)
  })
})

const stats = computed(() => (mod.value ? mod.value.stats(source.value) : []))

const columns = computed<TableColumnsType<LedgerRecord>>(() => {
  const current = mod.value
  if (!current) return []
  const dataColumns = current.fields
    .filter((item) => item.table)
    .map((item) => ({
      title: item.label,
      dataIndex: item.key,
      key: item.key,
      width: item.tableWidth,
      ellipsis: true,
    }))
  return [...dataColumns, { title: '操作', key: 'action', width: 140 }]
})

function fieldOf(key: unknown) {
  return mod.value?.fields.find((item) => item.key === key)
}

function filterOptions(field: LedgerField) {
  if (field.kind === 'park') return parks.map((item) => ({ value: item.id, label: item.shortName }))
  return (field.options ?? []).map((item) => ({ value: item, label: item }))
}

function clearFilters() {
  keyword.value = ''
  for (const field of filterFields.value) filters[field.key] = undefined
}

function create() {
  if (!mod.value) return
  void router.push({ name: `${mod.value.key}-create` })
}

function openDetail(id: string) {
  if (!mod.value) return
  void router.push({ name: `${mod.value.key}-detail`, params: { id } })
}

function openEdit(id: string) {
  if (!mod.value) return
  void router.push({ name: `${mod.value.key}-edit`, params: { id } })
}

const filteredEmpty = computed(() => source.value.length > 0 && rows.value.length === 0)

const pagination = {
  pageSize: 8,
  showTotal: (total: number) => `共 ${total} 条`,
}
</script>

<template>
  <a-result v-if="!mod" status="404" title="未找到该台账" />

  <ModuleFrame v-else :eyebrow="mod.eyebrow" :title="mod.title" :hint="mod.listHint">
    <template #extra>
      <a-button type="primary" ghost @click="create">
        <PlusOutlined />
        {{ mod.createLabel }}
      </a-button>
    </template>

    <StatRow :items="stats" />

    <a-card v-if="mod.links?.length" class="panel shortcut-card" :bordered="false">
      <div class="shortcuts">
        <span>快捷入口</span>
        <a-button v-for="link in mod.links" :key="link.to" @click="router.push(link.to)">{{ link.label }}</a-button>
      </div>
    </a-card>

    <a-card class="panel" :bordered="false">
      <div class="filters">
        <a-input-search v-model:value="keyword" allow-clear :placeholder="mod.searchPlaceholder" />
        <a-select
          v-for="field in filterFields"
          :key="field.key"
          v-model:value="filters[field.key]"
          allow-clear
          :placeholder="field.filterPlaceholder ?? `全部${field.label}`"
          :options="filterOptions(field)"
        />
      </div>

      <EmptyState
        v-if="rows.length === 0"
        :description="filteredEmpty ? '没有符合条件的记录。' : mod.emptyTitle"
        :action-label="filteredEmpty ? '清空筛选' : mod.createLabel"
        :secondary-label="filteredEmpty ? mod.createLabel : undefined"
        @action="filteredEmpty ? clearFilters() : create()"
        @secondary="create"
      />
      <a-table
        v-else
        :columns="columns"
        :data-source="rows"
        :pagination="pagination"
        row-key="id"
        :scroll="{ x: 1100 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-button type="link" @click="openDetail(record.id)">详情</a-button>
            <a-button type="link" @click="openEdit(record.id)">编辑</a-button>
          </template>
          <template v-else-if="column.key === mod.nameKey">
            <a @click.prevent="openDetail(record.id)">{{ show(fieldOf(column.key), record) }}</a>
          </template>
          <template v-else-if="fieldOf(column.key)?.status">
            <StatusTag :value="String(record[String(column.key)])" />
          </template>
          <template v-else>{{ show(fieldOf(column.key), record) }}</template>
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

.shortcut-card {
  margin-bottom: 16px;
}

.shortcuts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.shortcuts span {
  margin-right: 4px;
  color: #8a6a24;
  font-size: 12px;
  letter-spacing: 0.18em;
}

.filters {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) repeat(auto-fill, minmax(148px, 180px));
  gap: 12px;
  margin-bottom: 8px;
}

@media (max-width: 800px) {
  .filters {
    grid-template-columns: 1fr;
  }
}
</style>
