<script setup lang="ts">
import type { Rule } from 'ant-design-vue/es/form'
import { message } from 'ant-design-vue'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ModuleFrame from '../../components/ModuleFrame.vue'
import { ledgerByKey } from '../../ledger/modules'
import type { LedgerField } from '../../ledger/types'
import { parks } from '../../mock/parks'
import { useAffairsStore } from '../../stores/affairs'
import { useRegistryStore } from '../../stores/registry'

const route = useRoute()
const router = useRouter()
const affairs = useAffairsStore()
const registry = useRegistryStore()

const mod = computed(() => ledgerByKey(String(route.meta.ledger ?? '')) ?? null)
const recordId = computed(() => (typeof route.params.id === 'string' ? route.params.id : ''))
const editing = computed(() => Boolean(recordId.value))
const missing = ref(false)
const form = reactive<Record<string, string | number | null>>({})

const rules = computed(() => {
  const current = mod.value
  const result: Record<string, Rule[]> = {}
  if (!current) return result
  for (const field of current.fields) {
    const list: Rule[] = []
    if (field.required) {
      const choose = field.kind === 'select' || field.kind === 'park' || field.kind === 'enterprise'
      list.push({
        required: true,
        whitespace: field.kind === 'text' || field.kind === 'textarea',
        type: field.kind === 'number' ? 'number' : 'string',
        message: `${choose ? '请选择' : '请填写'}${field.label}`,
      })
    }
    if (field.pattern) {
      list.push({ pattern: field.pattern, message: field.patternMessage ?? '格式不正确' })
    }
    if (list.length) result[field.key] = list
  }
  return result
})

function applyBlank() {
  const current = mod.value
  if (!current) return
  for (const key of Object.keys(form)) delete form[key]
  for (const field of current.fields) form[field.key] = field.initial
}

watch(
  [mod, recordId],
  () => {
    missing.value = false
    const current = mod.value
    if (!current) return
    if (!recordId.value) {
      applyBlank()
      return
    }
    const found = affairs.byId(current.bucket, recordId.value)
    if (!found) {
      missing.value = true
      return
    }
    for (const field of current.fields) {
      const value = found[field.key]
      form[field.key] = value === undefined ? field.initial : value
    }
  },
  { immediate: true },
)

function optionsOf(field: LedgerField) {
  if (field.kind === 'park') return parks.map((item) => ({ value: item.id, label: item.name }))
  if (field.kind === 'enterprise') {
    return registry.state.enterprises.map((item) => ({ value: item.id, label: item.name }))
  }
  return (field.options ?? []).map((item) => ({ value: item, label: item }))
}

function back() {
  const current = mod.value
  if (!current) return
  if (recordId.value) {
    void router.push({ name: `${current.key}-detail`, params: { id: recordId.value } })
    return
  }
  void router.push({ name: current.key })
}

function onFinish() {
  const current = mod.value
  if (!current) return
  const payload: Record<string, string | number> = {}
  for (const field of current.fields) {
    const value = form[field.key]
    if (field.kind === 'number') payload[field.key] = Number(value ?? 0)
    else payload[field.key] = String(value ?? '').trim()
  }
  const saved = affairs.save(current.bucket, payload, current.idPrefix, recordId.value || undefined)
  if (!saved) {
    message.error('没有找到要修改的记录')
    return
  }
  message.success(editing.value ? '内容已更新' : '已写入本机台账')
  void router.push({ name: `${current.key}-detail`, params: { id: saved.id } })
}
</script>

<template>
  <a-result v-if="!mod" status="404" title="未找到该台账" />

  <ModuleFrame v-else :eyebrow="mod.eyebrow" :title="editing ? mod.editTitle : mod.createTitle" :hint="mod.formHint">
    <a-result v-if="missing" status="404" title="未找到这条记录">
      <template #extra>
        <a-button type="primary" @click="router.push({ name: mod.key })">返回列表</a-button>
      </template>
    </a-result>

    <a-card v-else class="panel" :bordered="false">
      <a-form layout="vertical" :model="form" :rules="rules" @finish="onFinish">
        <a-row :gutter="16">
          <a-col v-for="field in mod.fields" :key="field.key" :xs="24" :md="field.span ?? 12">
            <a-form-item :label="field.label" :name="field.key">
              <a-textarea
                v-if="field.kind === 'textarea'"
                v-model:value="form[field.key]"
                :placeholder="field.placeholder"
                :auto-size="{ minRows: 3, maxRows: 6 }"
              />
              <a-input-number
                v-else-if="field.kind === 'number'"
                v-model:value="form[field.key]"
                :min="field.min"
                :max="field.max"
                style="width: 100%"
              />
              <a-select
                v-else-if="field.kind === 'select' || field.kind === 'park' || field.kind === 'enterprise'"
                v-model:value="form[field.key]"
                :options="optionsOf(field)"
              />
              <a-input v-else v-model:value="form[field.key]" :placeholder="field.placeholder" />
            </a-form-item>
          </a-col>
        </a-row>
        <div class="actions">
          <a-button @click="back">取消</a-button>
          <a-button type="primary" html-type="submit">保存</a-button>
        </div>
      </a-form>
    </a-card>
  </ModuleFrame>
</template>

<style scoped>
.panel {
  border-radius: 14px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
