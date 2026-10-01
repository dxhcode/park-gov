<script setup lang="ts">
import type { Rule } from 'ant-design-vue/es/form'
import { message } from 'ant-design-vue'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ModuleFrame from '../../components/ModuleFrame.vue'
import { buildingsInPark } from '../../mock/lookups'
import { parks } from '../../mock/parks'
import { idleKinds, reviveStatuses, type IdleAssetInput, type IdleKind, type ReviveStatus } from '../../mock/types'
import { useRegistryStore } from '../../stores/registry'

const route = useRoute()
const router = useRouter()
const registry = useRegistryStore()

const recordId = computed(() => (typeof route.params.id === 'string' ? route.params.id : ''))
const editing = computed(() => Boolean(recordId.value))
const missing = ref(false)

function blank(): IdleAssetInput {
  return {
    parkId: 'park-binjiang',
    buildingId: '',
    name: '',
    kind: '闲置楼层',
    areaSqm: 200,
    areaNote: '',
    idleSince: '2026-10-02',
    reason: '',
    reviveStatus: '待盘活',
    plan: '',
    contact: '',
    phone: '',
  }
}

const form = reactive<IdleAssetInput>(blank())

const buildingOptions = computed(() => [
  { value: '', label: '无关联楼宇（用地）' },
  ...buildingsInPark(form.parkId).map((item) => ({ value: item.id, label: item.name })),
])

const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: '请填写闲置名称' }],
  kind: [{ required: true, message: '请选择类型' }],
  parkId: [{ required: true, message: '请选择园区' }],
  areaNote: [{ required: true, message: '请填写面积说明，如 420 ㎡ 或 46.5 亩' }],
  areaSqm: [{ required: true, type: 'number', min: 1, message: '面积需大于 0' }],
  idleSince: [
    { required: true, message: '请填写闲置起始日期' },
    { pattern: /^\d{4}-\d{2}-\d{2}$/, message: '日期格式为 YYYY-MM-DD' },
  ],
  reason: [{ required: true, message: '请填写闲置原因' }],
  reviveStatus: [{ required: true, message: '请选择盘活状态' }],
  plan: [{ required: true, message: '请填写盘活路径' }],
  contact: [{ required: true, message: '请填写联系人' }],
  phone: [
    { required: true, message: '请填写联系电话' },
    { pattern: /^[\d-]{8,16}$/, message: '请填写 8 到 16 位数字或连字符' },
  ],
}

watch(
  () => form.parkId,
  (parkId) => {
    if (!form.buildingId) return
    const options = buildingsInPark(parkId)
    if (!options.some((item) => item.id === form.buildingId)) form.buildingId = ''
  },
)

watch(
  () => form.kind,
  (kind) => {
    if (kind === '闲置用地') form.buildingId = ''
  },
)

watch(
  recordId,
  (id) => {
    missing.value = false
    if (!id) {
      Object.assign(form, blank())
      return
    }
    const found = registry.idleById(id)
    if (!found) {
      missing.value = true
      return
    }
    Object.assign(form, {
      parkId: found.parkId,
      buildingId: found.buildingId,
      name: found.name,
      kind: found.kind,
      areaSqm: found.areaSqm,
      areaNote: found.areaNote,
      idleSince: found.idleSince,
      reason: found.reason,
      reviveStatus: found.reviveStatus,
      plan: found.plan,
      contact: found.contact,
      phone: found.phone,
    })
  },
  { immediate: true },
)

function back() {
  if (recordId.value) {
    void router.push({ name: 'space-idle-detail', params: { id: recordId.value } })
    return
  }
  void router.push({ name: 'space-idle' })
}

function onFinish() {
  const saved = registry.saveIdle(
    {
      ...form,
      kind: form.kind as IdleKind,
      reviveStatus: form.reviveStatus as ReviveStatus,
      buildingId: form.kind === '闲置用地' ? '' : form.buildingId,
    },
    recordId.value || undefined,
  )
  if (!saved) {
    message.error('没有找到要修改的闲置记录')
    return
  }
  message.success(editing.value ? '闲置信息已更新' : '闲置已写入台账')
  void router.push({ name: 'space-idle-detail', params: { id: saved.id } })
}
</script>

<template>
  <ModuleFrame
    eyebrow="空间监管"
    :title="editing ? '编辑闲置' : '新建闲置'"
    hint="用地可以不关联楼宇。面积说明用于列表展示，可以写平方米或亩。"
  >
    <a-result v-if="missing" status="404" title="未找到该闲置记录">
      <template #extra>
        <a-button type="primary" @click="router.push({ name: 'space-idle' })">返回闲置</a-button>
      </template>
    </a-result>

    <a-card v-else class="panel" :bordered="false">
      <a-form layout="vertical" :model="form" :rules="rules" @finish="onFinish">
        <a-row :gutter="16">
          <a-col :xs="24" :md="12">
            <a-form-item label="名称" name="name">
              <a-input v-model:value="form.name" placeholder="例如 B2 实验楼四层东区" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="类型" name="kind">
              <a-select v-model:value="form.kind" :options="idleKinds.map((item) => ({ value: item, label: item }))" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="所在园区" name="parkId">
              <a-select v-model:value="form.parkId" :options="parks.map((item) => ({ value: item.id, label: item.name }))" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="关联楼宇" name="buildingId">
              <a-select v-model:value="form.buildingId" :disabled="form.kind === '闲置用地'" :options="buildingOptions" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="8">
            <a-form-item label="面积说明" name="areaNote">
              <a-input v-model:value="form.areaNote" placeholder="420 ㎡ 或 46.5 亩" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="8">
            <a-form-item label="折算面积（㎡）" name="areaSqm">
              <a-input-number v-model:value="form.areaSqm" :min="1" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="8">
            <a-form-item label="盘活状态" name="reviveStatus">
              <a-select
                v-model:value="form.reviveStatus"
                :options="reviveStatuses.map((item) => ({ value: item, label: item }))"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="闲置起始" name="idleSince">
              <a-input v-model:value="form.idleSince" placeholder="YYYY-MM-DD" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="联系人" name="contact">
              <a-input v-model:value="form.contact" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="联系电话" name="phone">
              <a-input v-model:value="form.phone" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="闲置原因" name="reason">
              <a-textarea v-model:value="form.reason" :rows="2" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="盘活路径" name="plan">
              <a-textarea v-model:value="form.plan" :rows="2" />
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
