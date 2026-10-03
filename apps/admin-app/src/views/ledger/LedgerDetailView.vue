<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ModuleFrame from '../../components/ModuleFrame.vue'
import StatusTag from '../../components/StatusTag.vue'
import { formatLedgerValue } from '../../ledger/format'
import { ledgerByKey } from '../../ledger/modules'
import type { LedgerField } from '../../ledger/types'
import ScreenLink from '../../components/ScreenLink.vue'
import { useAffairsStore } from '../../stores/affairs'
import { useRegistryStore } from '../../stores/registry'

const route = useRoute()
const router = useRouter()
const affairs = useAffairsStore()
const registry = useRegistryStore()

const mod = computed(() => ledgerByKey(String(route.meta.ledger ?? '')) ?? null)
const recordId = computed(() => (typeof route.params.id === 'string' ? route.params.id : ''))
const record = computed(() => (mod.value ? affairs.byId(mod.value.bucket, recordId.value) : undefined))

const statusFields = computed(() => mod.value?.fields.filter((item) => item.status && item.key !== mod.value?.nameKey) ?? [])
const nameField = computed(() => mod.value?.fields.find((item) => item.key === mod.value?.nameKey))

function enterpriseName(field: LedgerField, value: string) {
  if (field.kind !== 'enterprise') return undefined
  return registry.enterpriseById(value)?.name ?? ''
}

function show(field: LedgerField) {
  if (!record.value) return '—'
  return formatLedgerValue(field, record.value, enterpriseName(field, String(record.value[field.key] ?? '')))
}

function back() {
  if (!mod.value) return
  void router.push({ name: mod.value.key })
}

function edit() {
  if (!mod.value) return
  void router.push({ name: `${mod.value.key}-edit`, params: { id: recordId.value } })
}

function openEnterprise(id: string) {
  void router.push({ name: 'enterprise-directory-detail', params: { id } })
}

const screenJump: Record<string, { label: string; scene: string }> = {
  workbench: { label: '监管总览大屏', scene: '/overview' },
  'enterprise-risk': { label: '企业风险大屏', scene: '/enterprise-risk' },
  'space-land': { label: '空间态势大屏', scene: '/space' },
  assessment: { label: '考核看板', scene: '/assessment' },
  complaint: { label: '投诉热力', scene: '/complaint-heat' },
}

const jump = computed(() => (mod.value ? screenJump[mod.value.key] : undefined))
</script>

<template>
  <a-result v-if="!mod" status="404" title="未找到该台账" />

  <ModuleFrame v-else :eyebrow="mod.eyebrow" :title="mod.detailTitle" :hint="mod.detailHint">
    <template v-if="record" #extra>
      <ScreenLink v-if="jump" :scene="jump.scene" :label="jump.label" />
      <a-button @click="back">返回列表</a-button>
      <a-button type="primary" @click="edit">编辑</a-button>
    </template>

    <a-result v-if="!record" status="404" title="未找到这条记录" sub-title="记录不在本地台账中。">
      <template #extra>
        <a-button type="primary" @click="back">返回列表</a-button>
      </template>
    </a-result>

    <a-card v-else class="panel" :bordered="false">
      <div class="title-row">
        <h2>{{ nameField ? show(nameField) : '—' }}</h2>
        <StatusTag v-for="field in statusFields" :key="field.key" :value="String(record[field.key])" />
      </div>
      <a-descriptions bordered :column="{ xs: 1, md: 2 }">
        <a-descriptions-item
          v-for="field in mod.fields"
          :key="field.key"
          :label="field.label"
          :span="field.kind === 'textarea' ? 2 : 1"
        >
          <template v-if="field.status">
            <StatusTag :value="String(record[field.key])" />
          </template>
          <template v-else-if="field.kind === 'enterprise' && registry.enterpriseById(String(record[field.key]))">
            <a @click.prevent="openEnterprise(String(record[field.key]))">{{ show(field) }}</a>
          </template>
          <template v-else>{{ show(field) }}</template>
        </a-descriptions-item>
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
  flex-wrap: wrap;
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
