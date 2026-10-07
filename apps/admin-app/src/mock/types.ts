/** 字段形态对齐 park-shared 的园区主数据，并补上政府端台账需要的证照与空间字段。 */

export type ParkType = '科技园' | '产业园' | '综合园'
export type ParkStatus = '运营中' | '建设中'
export type EnterpriseScale = '大型' | '中型' | '小型'
export type EnterpriseStatus = '在园' | '待入驻' | '已迁出'
export type BuildingUsage = '研发' | '生产' | '办公' | '配套'
export type RoomUsage = BuildingUsage | '仓储'
export type RoomStatus = '在用' | '空置待租' | '装修中'
export type IdleKind = '闲置厂房' | '闲置楼层' | '闲置用地'
export type ReviveStatus = '待盘活' | '洽谈中' | '已盘活'

export const enterpriseScales: EnterpriseScale[] = ['大型', '中型', '小型']
export const enterpriseStatuses: EnterpriseStatus[] = ['在园', '待入驻', '已迁出']
export const industries = [
  '人工智能',
  '生物医药',
  '软件信息',
  '高端装备',
  '新能源',
  '供应链',
  '医疗器械',
  '合成生物',
  '集成电路',
  '检验检测',
] as const
export const roomUsages: RoomUsage[] = ['研发', '生产', '办公', '配套', '仓储']
export const roomStatuses: RoomStatus[] = ['在用', '空置待租', '装修中']
export const idleKinds: IdleKind[] = ['闲置厂房', '闲置楼层', '闲置用地']
export const reviveStatuses: ReviveStatus[] = ['待盘活', '洽谈中', '已盘活']

export interface Park {
  id: string
  name: string
  shortName: string
  code: string
  city: string
  district: string
  address: string
  areaMu: number
  establishedYear: number
  type: ParkType
  status: ParkStatus
  description: string
  manager: string
  phone: string
}

export interface Building {
  id: string
  parkId: string
  name: string
  code: string
  floors: number
  areaSqm: number
  usage: BuildingUsage
  occupancyRate: number
}

export interface Enterprise {
  id: string
  parkId: string
  buildingId: string
  name: string
  creditCode: string
  industry: string
  scale: EnterpriseScale
  employeeCount: number
  registeredCapital: string
  legalPerson: string
  contact: string
  phone: string
  settledAt: string
  status: EnterpriseStatus
  address: string
}

export interface SpaceRoom {
  id: string
  parkId: string
  buildingId: string
  name: string
  floor: string
  areaSqm: number
  usage: RoomUsage
  status: RoomStatus
  enterpriseId: string | null
  leaseStart: string
  leaseEnd: string
  rentYuan: number
  note: string
}

export interface IdleAsset {
  id: string
  parkId: string
  buildingId: string
  name: string
  kind: IdleKind
  areaSqm: number
  areaNote: string
  idleSince: string
  reason: string
  reviveStatus: ReviveStatus
  plan: string
  contact: string
  phone: string
}

export type EnterpriseInput = Omit<Enterprise, 'id'>
export type SpaceRoomInput = Omit<SpaceRoom, 'id'>
export type IdleAssetInput = Omit<IdleAsset, 'id'>
