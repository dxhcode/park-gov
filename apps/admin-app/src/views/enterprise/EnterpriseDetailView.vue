<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ModuleFrame from '../../components/ModuleFrame.vue'
import ScreenLink from '../../components/ScreenLink.vue'
import StatusTag from '../../components/StatusTag.vue'
import { buildingLabel, formatArea, formatRent, parkLabel, parkOf } from '../../mock/lookups'
import { useAffairsStore } from '../../stores/affairs'
import { useRegistryStore } from '../../stores/registry'

const route = useRoute()
const router = useRouter()
const registry = useRegistryStore()
const affairs = useAffairsStore()

const id = computed(() => (typeof route.params.id === 'string' ? route.params.id : ''))
const record = computed(() => registry.enterpriseById(id.value))
const park = computed(() => (record.value ? parkOf(record.value.parkId) : undefined))
const leasedRooms = computed(() => registry.roomsOfEnterprise(id.value))
const risks = computed(() => affairs.state.risks.filter((item) => item.enterpriseId === id.value))
const relatedIdles = computed(() => {
  const buildingIds = new Set(leasedRooms.value.map((item) => item.buildingId))
  if (record.value?.buildingId) buildingIds.add(record.value.buildingId)
  return registry.state.idles.filter((item) => item.buildingId && buildingIds.has(item.buildingId))
})

function back() {
  void router.push({ name: 'enterprise-directory' })
}

function edit() {
  void router.push({ name: 'enterprise-directory-edit', params: { id: id.value } })
}

function fieldText(record: object, key: unknown) {
  if (typeof key !== 'string') return ''
  const value = (record as Record<string, unknown>)[key]
  return value == null ? '' : String(value)
}
</script>

<template>
  <ModuleFrame eyebrow="企业监管" title="企业详情" hint="主体档案、入驻关系与当前承租用房。">
    <template v-if="record" #extra>
      <ScreenLink scene="/enterprise-risk" label="企业风险大屏" />
      <a-button @click="back">返回名录</a-button>
      <a-button type="primary" @click="edit">编辑</a-button>
    </template>

    <a-result v-if="!record" status="404" title="未找到该企业" sub-title="记录不在本地名录中。">
      <template #extra>
        <a-button type="primary" @click="back">返回名录</a-button>
      </template>
    </a-result>

    <template v-else>
      <a-card class="panel" :bordered="false">
        <div class="title-row">
          <h2>{{ record.name }}</h2>
          <StatusTag :value="record.status" />
        </div>
        <a-descriptions bordered :column="{ xs: 1, md: 2 }">
          <a-descriptions-item label="统一社会信用代码">{{ record.creditCode }}</a-descriptions-item>
          <a-descriptions-item label="法定代表人">{{ record.legalPerson }}</a-descriptions-item>
          <a-descriptions-item label="行业">{{ record.industry }}</a-descriptions-item>
          <a-descriptions-item label="规模">{{ record.scale }}</a-descriptions-item>
          <a-descriptions-item label="从业人数">{{ record.employeeCount }} 人</a-descriptions-item>
          <a-descriptions-item label="注册资本">{{ record.registeredCapital }}</a-descriptions-item>
          <a-descriptions-item label="所在园区">{{ park?.name ?? parkLabel(record.parkId) }}</a-descriptions-item>
          <a-descriptions-item label="所在楼宇">{{ buildingLabel(record.buildingId) }}</a-descriptions-item>
          <a-descriptions-item label="入驻日期">{{ record.settledAt }}</a-descriptions-item>
          <a-descriptions-item label="联系人">{{ record.contact }} · {{ record.phone }}</a-descriptions-item>
          <a-descriptions-item label="经营地址" :span="2">{{ record.address }}</a-descriptions-item>
        </a-descriptions>
      </a-card>

      <a-card class="panel" :bordered="false" title="承租用房">
        <a-empty v-if="leasedRooms.length === 0" description="名录中没有挂到这家企业的用房。" />
        <a-table
          v-else
          :data-source="leasedRooms"
          :pagination="false"
          row-key="id"
          :columns="[
            { title: '载体', dataIndex: 'name', key: 'name' },
            { title: '楼层', dataIndex: 'floor' },
            { title: '面积', key: 'area' },
            { title: '状态', dataIndex: 'status', key: 'status' },
            { title: '租金', key: 'rent' },
          ]"
        >
          <template #bodyCell="{ column, record: room }">
            <template v-if="column.key === 'name'">
              <a @click.prevent="router.push({ name: 'space-building-detail', params: { id: room.id } })">
                {{ room.name }}
              </a>
            </template>
            <template v-else-if="column.key === 'area'">{{ formatArea(room.areaSqm) }}</template>
            <template v-else-if="column.key === 'status'">
              <StatusTag :value="room.status" />
            </template>
            <template v-else-if="column.key === 'rent'">{{ formatRent(room.rentYuan) }}</template>
          </template>
        </a-table>
      </a-card>

      <a-card class="panel" :bordered="false" title="风险画像">
        <a-empty v-if="risks.length === 0" description="这家企业还没有风险画像。" />
        <a-table
          v-else
          :data-source="risks"
          :pagination="false"
          row-key="id"
          :columns="[
            { title: '异常信号', dataIndex: 'signal', key: 'signal' },
            { title: '等级', dataIndex: 'level', key: 'level', width: 100 },
            { title: '风险分', dataIndex: 'score', width: 90 },
            { title: '处置', dataIndex: 'status', key: 'status', width: 100 },
          ]"
        >
          <template #bodyCell="{ column, record: risk }">
            <template v-if="column.key === 'signal'">
              <a @click.prevent="router.push({ name: 'enterprise-risk-detail', params: { id: risk.id } })">
                {{ risk.signal }}
              </a>
            </template>
            <template v-else-if="column.key === 'level' || column.key === 'status'">
              <StatusTag :value="fieldText(risk, column.key)" />
            </template>
            <template v-else>{{ fieldText(risk, column.dataIndex) }}</template>
          </template>
        </a-table>
      </a-card>

      <a-card class="panel" :bordered="false" title="同楼闲置">
        <a-empty v-if="relatedIdles.length === 0" description="当前楼宇没有挂接的闲置记录。" />
        <a-table
          v-else
          :data-source="relatedIdles"
          :pagination="false"
          row-key="id"
          :columns="[
            { title: '名称', dataIndex: 'name', key: 'name' },
            { title: '类型', dataIndex: 'kind', width: 110 },
            { title: '面积', dataIndex: 'areaNote', width: 140 },
            { title: '盘活', dataIndex: 'reviveStatus', key: 'reviveStatus', width: 100 },
          ]"
        >
          <template #bodyCell="{ column, record: idle }">
            <template v-if="column.key === 'name'">
              <a @click.prevent="router.push({ name: 'space-idle-detail', params: { id: idle.id } })">
                {{ idle.name }}
              </a>
            </template>
            <template v-else-if="column.key === 'reviveStatus'">
              <StatusTag :value="idle.reviveStatus" />
            </template>
            <template v-else>{{ fieldText(idle, column.dataIndex) }}</template>
          </template>
        </a-table>
      </a-card>
    </template>
  </ModuleFrame>
</template>

<style scoped>
.panel {
  margin-bottom: 16px;
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
