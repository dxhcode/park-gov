import { buildings, enterprises as sharedEnterprises, parks } from '@park/mock'
import type { Enterprise } from './types'

export { buildings, parks }

/**
 * 共享主数据没有法定代表人和经营地址。政府端台账补上这两项，
 * 并保留共享清单之外的四家企业，演示走查仍能点到澄江、北麓、浦潮、东湖。
 */
const profiles: Record<string, Pick<Enterprise, 'legalPerson' | 'address'>> = {
  'ent-xinglan': {
    legalPerson: '沈予安',
    address: '杭州市滨江区网商路 599 号 A1 研发楼',
  },
  'ent-qinghe': {
    legalPerson: '林知夏',
    address: '杭州市滨江区网商路 599 号 B2 实验楼',
  },
  'ent-luanshu': {
    legalPerson: '赵衡',
    address: '杭州市滨江区网商路 599 号 A1 研发楼',
  },
  'ent-haiyi': {
    legalPerson: '马屹',
    address: '上海市浦东新区海港大道 1555 号 M1 智能厂房',
  },
  'ent-yuanneng': {
    legalPerson: '顾清和',
    address: '上海市浦东新区海港大道 1555 号 M2 动力站',
  },
  'ent-jinfan': {
    legalPerson: '吴帆',
    address: '上海市浦东新区海港大道 1555 号（档案保留）',
  },
  'ent-qiming': {
    legalPerson: '何晚宁',
    address: '武汉市东湖高新区高新大道 818 号 C1 研发中心',
  },
  'ent-baiyu': {
    legalPerson: '许屿',
    address: '武汉市东湖高新区高新大道 818 号 C2 中试楼',
  },
}

const govOnly: Enterprise[] = [
  {
    id: 'ent-chengjiang',
    parkId: 'park-binjiang',
    buildingId: 'bld-bj-a1',
    name: '澄江半导体设计有限公司',
    creditCode: '91330108MOCK00009X',
    industry: '集成电路',
    scale: '中型',
    employeeCount: 210,
    registeredCapital: '1 亿人民币',
    legalPerson: '叶澄',
    contact: '叶澄',
    phone: '0571-86001109',
    settledAt: '2024-07-01',
    status: '在园',
    address: '杭州市滨江区网商路 599 号 A1 研发楼',
  },
  {
    id: 'ent-beilu',
    parkId: 'park-binjiang',
    buildingId: 'bld-bj-b2',
    name: '北麓云测技术有限公司',
    creditCode: '91330108MOCK00010X',
    industry: '检验检测',
    scale: '小型',
    employeeCount: 36,
    registeredCapital: '600 万人民币',
    legalPerson: '方麓',
    contact: '方麓',
    phone: '0571-86001110',
    settledAt: '2025-03-22',
    status: '在园',
    address: '杭州市滨江区网商路 599 号 B2 实验楼',
  },
  {
    id: 'ent-puchao',
    parkId: 'park-lingang',
    buildingId: 'bld-lg-m1',
    name: '浦潮精密制造有限公司',
    creditCode: '91310115MOCK00011X',
    industry: '高端装备',
    scale: '中型',
    employeeCount: 188,
    registeredCapital: '4500 万人民币',
    legalPerson: '蒋潮',
    contact: '蒋潮',
    phone: '021-58002111',
    settledAt: '2021-12-06',
    status: '在园',
    address: '上海市浦东新区海港大道 1555 号 M1 智能厂房',
  },
  {
    id: 'ent-donghu',
    parkId: 'park-guanggu',
    buildingId: 'bld-gg-c1',
    name: '东湖检验检测有限公司',
    creditCode: '91420100MOCK00012X',
    industry: '检验检测',
    scale: '小型',
    employeeCount: 48,
    registeredCapital: '1000 万人民币',
    legalPerson: '曹湖',
    contact: '曹湖',
    phone: '027-87003112',
    settledAt: '2023-08-14',
    status: '在园',
    address: '武汉市东湖高新区高新大道 818 号 C1 研发中心',
  },
]

const sharedById = new Map(sharedEnterprises.map((item) => [item.id, item]))

function fromShared(id: string): Enterprise {
  const item = sharedById.get(id)
  const profile = profiles[id]
  if (!item || !profile) throw new Error(`@park/mock 企业 ${id} 无法对齐政府端档案`)
  return { ...item, ...profile }
}

/** 顺序与原来的名录一致，方便演示时按滨江筛选仍看到这五家。 */
const enterpriseOrder = [
  'ent-xinglan',
  'ent-qinghe',
  'ent-luanshu',
  'ent-chengjiang',
  'ent-beilu',
  'ent-haiyi',
  'ent-yuanneng',
  'ent-jinfan',
  'ent-puchao',
  'ent-qiming',
  'ent-baiyu',
  'ent-donghu',
]

const govById = new Map(govOnly.map((item) => [item.id, item]))

export const enterprises: Enterprise[] = enterpriseOrder.map((id) => govById.get(id) ?? fromShared(id))
