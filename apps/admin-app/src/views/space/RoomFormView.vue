<script setup lang="ts">
import type { Rule } from 'ant-design-vue/es/form'
import { message } from 'ant-design-vue'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ModuleFrame from '../../components/ModuleFrame.vue'
import { buildingsInPark } from '../../mock/lookups'
import { parks } from '../../mock/parks'
import { roomStatuses, roomUsages, type RoomStatus, type SpaceRoomInput } from '../../mock/types'
import { useRegistryStore } from '../../stores/registry'

const route = useRoute()
const router = useRouter()
const registry = useRegistryStore()

const recordId = computed(() => (typeof route.params.id === 'string' ? route.params.id : ''))
const editing = computed(() => Boolean(recordId.value))
const missing = ref(false)

function blank(): SpaceRoomInput {
  return {
    parkId: 'park-binjiang',
    buildingId: 'bld-bj-a1',
    name: '',
    floor: '',
    areaSqm: 200,
    usage: '办公',
    status: '空置待租',
    enterpriseId: null,
    leaseStart: '',
    leaseEnd: '',
    rentYuan: 3,
    note: '',
  }
}

const form = reactive<SpaceRoomInput>(blank())

const buildingOptions = computed(() =>
  buildingsInPark(form.parkId).map((item) => ({ value: item.id, label: item.name })),
)

const enterpriseOptions = computed(() =>
  registry.state.enterprises
    .filter((item) => item.parkId === form.parkId)
    .map((item) => ({ value: item.id, label: item.name })),
)

const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: '请填写载体名称或房号' }],
  parkId: [{ required: true, message: '请选择园区' }],
  buildingId: [{ required: true, message: '请选择楼宇' }],
  floor: [{ required: true, message: '请填写楼层' }],
  areaSqm: [{ required: true, type: 'number', min: 1, message: '面积需大于 0' }],
  usage: [{ required: true, message: '请选择用途' }],
  status: [{ required: true, message: '请选择使用状态' }],
  rentYuan: [{ required: true, type: 'number', min: 0, message: '请填写租金' }],
}

watch(
  () => form.parkId,
  (parkId) => {
    const options = buildingsInPark(parkId)
    if (!options.some((item) => item.id === form.buildingId)) {
      form.buildingId = options[0]?.id ?? ''
    }
    if (form.enterpriseId && !registry.state.enterprises.some((item) => item.id === form.enterpriseId && item.parkId === parkId)) {
      form.enterpriseId = null
    }
  },
)

watch(
  () => form.status,
  (status) => {
    if (status === '空置待租') form.enterpriseId = null
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
    const found = registry.roomById(id)
    if (!found) {
      missing.value = true
      return
    }
    Object.assign(form, {
      parkId: found.parkId,
      buildingId: found.buildingId,
      name: found.name,
      floor: found.floor,
      areaSqm: found.areaSqm,
      usage: found.usage,
      status: found.status,
      enterpriseId: found.enterpriseId,
      leaseStart: found.leaseStart,
      leaseEnd: found.leaseEnd,
      rentYuan: found.rentYuan,
      note: found.note,
    })
  },
  { immediate: true },
)

function back() {
  if (recordId.value) {
    void router.push({ name: 'space-building-detail', params: { id: recordId.value } })
    return
  }
  void router.push({ name: 'space-building' })
}

function onFinish() {
  if (form.status === '在用' && !form.enterpriseId) {
    message.warning('在用状态需要选择承租企业')
    return
  }
  const saved = registry.saveRoom(
    {
      ...form,
      status: form.status as RoomStatus,
      enterpriseId: form.status === '空置待租' ? null : form.enterpriseId,
      leaseStart: form.leaseStart.trim(),
      leaseEnd: form.leaseEnd.trim(),
    },
    recordId.value || undefined,
  )
  if (!saved) {
    message.error('没有找到要修改的用房')
    return
  }
  message.success(editing.value ? '用房信息已更新' : '用房已写入台账')
  void router.push({ name: 'space-building-detail', params: { id: saved.id } })
}
</script>

<template>
  <ModuleFrame
    eyebrow="空间监管"
    :title="editing ? '编辑用房' : '新建用房'"
    hint="在用或装修中可挂承租企业。空置待租会清空承租关系。"
  >
    <a-result v-if="missing" status="404" title="未找到该用房">
      <template #extra>
        <a-button type="primary" @click="router.push({ name: 'space-building' })">返回用房</a-button>
      </template>
    </a-result>

    <a-card v-else class="panel" :bordered="false">
      <a-form layout="vertical" :model="form" :rules="rules" @finish="onFinish">
        <a-row :gutter="16">
          <a-col :xs="24" :md="12">
            <a-form-item label="载体名称" name="name">
              <a-input v-model:value="form.name" placeholder="例如 A1-908" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="楼层" name="floor">
              <a-input v-model:value="form.floor" placeholder="例如 9 层" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="所在园区" name="parkId">
              <a-select v-model:value="form.parkId" :options="parks.map((item) => ({ value: item.id, label: item.name }))" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="所在楼宇" name="buildingId">
              <a-select v-model:value="form.buildingId" :options="buildingOptions" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="8">
            <a-form-item label="建筑面积（㎡）" name="areaSqm">
              <a-input-number v-model:value="form.areaSqm" :min="1" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="8">
            <a-form-item label="用途" name="usage">
              <a-select v-model:value="form.usage" :options="roomUsages.map((item) => ({ value: item, label: item }))" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="8">
            <a-form-item label="使用状态" name="status">
              <a-select v-model:value="form.status" :options="roomStatuses.map((item) => ({ value: item, label: item }))" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="承租企业" name="enterpriseId">
              <a-select
                v-model:value="form.enterpriseId"
                allow-clear
                placeholder="空置可留空"
                :disabled="form.status === '空置待租'"
                :options="enterpriseOptions"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="租金（元/㎡·月）" name="rentYuan">
              <a-input-number v-model:value="form.rentYuan" :min="0" :step="0.1" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="租期起" name="leaseStart">
              <a-input v-model:value="form.leaseStart" placeholder="YYYY-MM-DD，可空" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="租期止" name="leaseEnd">
              <a-input v-model:value="form.leaseEnd" placeholder="YYYY-MM-DD，可空" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="备注" name="note">
              <a-textarea v-model:value="form.note" :rows="3" />
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
