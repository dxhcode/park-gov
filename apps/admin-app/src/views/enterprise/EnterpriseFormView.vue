<script setup lang="ts">
import type { Rule } from 'ant-design-vue/es/form'
import { message } from 'ant-design-vue'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ModuleFrame from '../../components/ModuleFrame.vue'
import { buildingsInPark } from '../../mock/lookups'
import { parks } from '../../mock/parks'
import {
  enterpriseScales,
  enterpriseStatuses,
  industries,
  type EnterpriseInput,
  type EnterpriseStatus,
} from '../../mock/types'
import { useRegistryStore } from '../../stores/registry'

const route = useRoute()
const router = useRouter()
const registry = useRegistryStore()

const recordId = computed(() => (typeof route.params.id === 'string' ? route.params.id : ''))
const editing = computed(() => Boolean(recordId.value))
const missing = ref(false)

function blank(): EnterpriseInput {
  return {
    parkId: 'park-binjiang',
    buildingId: 'bld-bj-a1',
    name: '',
    creditCode: '',
    industry: '软件信息',
    scale: '小型',
    employeeCount: 20,
    registeredCapital: '',
    legalPerson: '',
    contact: '',
    phone: '',
    settledAt: '2026-10-02',
    status: '待入驻',
    address: '',
  }
}

const form = reactive<EnterpriseInput>(blank())

const buildingOptions = computed(() =>
  buildingsInPark(form.parkId).map((item) => ({ value: item.id, label: item.name })),
)

const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: '请填写企业名称' }],
  creditCode: [
    { required: true, message: '请填写统一社会信用代码' },
    { pattern: /^[0-9A-Z]{18}$/, message: '需为 18 位大写字母或数字，演示码可含 MOCK' },
  ],
  legalPerson: [{ required: true, message: '请填写法定代表人' }],
  industry: [{ required: true, message: '请选择行业' }],
  parkId: [{ required: true, message: '请选择园区' }],
  buildingId: [{ required: true, message: '请选择楼宇' }],
  contact: [{ required: true, message: '请填写联系人' }],
  phone: [
    { required: true, message: '请填写联系电话' },
    { pattern: /^[\d-]{8,16}$/, message: '请填写 8 到 16 位数字或连字符' },
  ],
  settledAt: [
    { required: true, message: '请填写入驻日期' },
    { pattern: /^\d{4}-\d{2}-\d{2}$/, message: '日期格式为 YYYY-MM-DD' },
  ],
  status: [{ required: true, message: '请选择入驻状态' }],
  address: [{ required: true, message: '请填写经营地址' }],
  registeredCapital: [{ required: true, message: '请填写注册资本' }],
}

watch(
  () => form.creditCode,
  (value) => {
    const next = value.trim().toUpperCase()
    if (next !== value) form.creditCode = next
  },
)

watch(
  () => form.parkId,
  (parkId) => {
    const options = buildingsInPark(parkId)
    if (!options.some((item) => item.id === form.buildingId)) {
      form.buildingId = options[0]?.id ?? ''
    }
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
    const found = registry.enterpriseById(id)
    if (!found) {
      missing.value = true
      return
    }
    form.parkId = found.parkId
    form.buildingId = found.buildingId
    form.name = found.name
    form.creditCode = found.creditCode
    form.industry = found.industry
    form.scale = found.scale
    form.employeeCount = found.employeeCount
    form.registeredCapital = found.registeredCapital
    form.legalPerson = found.legalPerson
    form.contact = found.contact
    form.phone = found.phone
    form.settledAt = found.settledAt
    form.status = found.status
    form.address = found.address
  },
  { immediate: true },
)

function back() {
  if (recordId.value) {
    void router.push({ name: 'enterprise-directory-detail', params: { id: recordId.value } })
    return
  }
  void router.push({ name: 'enterprise-directory' })
}

function onFinish() {
  const saved = registry.saveEnterprise({ ...form, status: form.status as EnterpriseStatus }, recordId.value || undefined)
  if (!saved) {
    message.error('没有找到要修改的企业')
    return
  }
  message.success(editing.value ? '企业信息已更新' : '企业已写入名录')
  void router.push({ name: 'enterprise-directory-detail', params: { id: saved.id } })
}
</script>

<template>
  <ModuleFrame
    eyebrow="企业监管"
    :title="editing ? '编辑企业' : '新建企业'"
    hint="保存后写入本机浏览器。信用代码请使用大写，演示数据里的 MOCK 字样可以保留。"
  >
    <a-result v-if="missing" status="404" title="未找到该企业">
      <template #extra>
        <a-button type="primary" @click="router.push({ name: 'enterprise-directory' })">返回名录</a-button>
      </template>
    </a-result>

    <a-card v-else class="panel" :bordered="false">
      <a-form layout="vertical" :model="form" :rules="rules" @finish="onFinish">
        <a-row :gutter="16">
          <a-col :xs="24" :md="12">
            <a-form-item label="企业名称" name="name">
              <a-input v-model:value="form.name" placeholder="例如 星澜智造科技有限公司" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="统一社会信用代码" name="creditCode">
              <a-input v-model:value="form.creditCode" placeholder="18 位，如 91330108MOCK00013X" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="法定代表人" name="legalPerson">
              <a-input v-model:value="form.legalPerson" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="行业" name="industry">
              <a-select v-model:value="form.industry" :options="industries.map((item) => ({ value: item, label: item }))" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="8">
            <a-form-item label="规模" name="scale">
              <a-select v-model:value="form.scale" :options="enterpriseScales.map((item) => ({ value: item, label: item }))" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="8">
            <a-form-item label="从业人数" name="employeeCount">
              <a-input-number v-model:value="form.employeeCount" :min="0" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="8">
            <a-form-item label="入驻状态" name="status">
              <a-select
                v-model:value="form.status"
                :options="enterpriseStatuses.map((item) => ({ value: item, label: item }))"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="注册资本" name="registeredCapital">
              <a-input v-model:value="form.registeredCapital" placeholder="例如 2000 万人民币" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="入驻日期" name="settledAt">
              <a-input v-model:value="form.settledAt" placeholder="YYYY-MM-DD" />
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
          <a-col :xs="24" :md="12">
            <a-form-item label="联系人" name="contact">
              <a-input v-model:value="form.contact" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="联系电话" name="phone">
              <a-input v-model:value="form.phone" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="经营地址" name="address">
              <a-input v-model:value="form.address" />
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
