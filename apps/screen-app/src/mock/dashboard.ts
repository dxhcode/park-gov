/** 大屏样例。园区名称和电话取自 @park/mock，风险与产值仍是政府端快照。电话、信用代码和金额都是虚构的。 */
import { parks as masterParks } from '@park/mock'
import { screenChartPalette } from '@park/theme'

const chartColors = {
  cyan: screenChartPalette[0],
  gold: screenChartPalette[4],
  violet: screenChartPalette[2],
  rose: screenChartPalette[5],
  mint: screenChartPalette[3],
} as const

function masterPark(id: string) {
  const park = masterParks.find((item) => item.id === id)
  if (!park) throw new Error(`@park/mock 缺少园区 ${id}`)
  return park
}

export interface ParkNode {
  id: string
  name: string
  shortName: string
  city: string
  phone: string
  x: number
  y: number
  outputYi: number
  enterprises: number
  inPark: number
  highRisk: number
  occupancy: number
  idleSqm: number
  complaints: number
  heat: number
  brief: string
}

export interface Metric {
  label: string
  value: number
  suffix?: string
  digits?: number
  hint: string
  tone?: 'cyan' | 'gold' | 'rose'
}

export interface TickerItem {
  label: string
  value: string
}

export interface FeedItem {
  id: string
  level: string
  title: string
  meta: string
}

export interface BarItem {
  label: string
  value: number
  display?: string
}

export interface RingItem {
  label: string
  value: number
  color: string
}

export interface Series {
  name: string
  color: string
  values: number[]
}

export interface Parcel {
  parkId: string
  name: string
  note: string
  tone: 'use' | 'idle' | 'reserve' | 'risk'
  heat: number
}

export interface RiskCard {
  name: string
  enterpriseId: string
  creditCode: string
  park: string
  phone: string
  level: string
  score: number
  signal: string
}

export interface ScoreRow {
  name: string
  park: string
  category: string
  score: number
  progress: string
}

export const parkNodes: ParkNode[] = [
  {
    id: 'park-binjiang',
    name: masterPark('park-binjiang').name,
    shortName: '滨江云栖',
    city: '杭州 · 滨江',
    phone: masterPark('park-binjiang').phone,
    x: 478,
    y: 312,
    outputYi: 62.8,
    enterprises: 5,
    inPark: 4,
    highRisk: 1,
    occupancy: 0.8,
    idleSqm: 1690,
    complaints: 3,
    heat: 0.72,
    brief: '数字经济、人工智能与集成电路。在园含星澜智造、青禾生物、澄江半导体、北麓云测。',
  },
  {
    id: 'park-lingang',
    name: masterPark('park-lingang').name,
    shortName: '临港智造',
    city: '上海 · 浦东',
    phone: masterPark('park-lingang').phone,
    x: 548,
    y: 188,
    outputYi: 91.5,
    enterprises: 4,
    inPark: 3,
    highRisk: 1,
    occupancy: 0.8,
    idleSqm: 2400,
    complaints: 3,
    heat: 0.9,
    brief: '高端装备与新能源。海弈装备、远能动力、浦潮精密在园，锦帆物流已迁出。',
  },
  {
    id: 'park-guanggu',
    name: masterPark('park-guanggu').name,
    shortName: '光谷生命',
    city: '武汉 · 东湖',
    phone: masterPark('park-guanggu').phone,
    x: 286,
    y: 246,
    outputYi: 32.1,
    enterprises: 3,
    inPark: 2,
    highRisk: 0,
    occupancy: 0.45,
    idleSqm: 6600,
    complaints: 2,
    heat: 0.48,
    brief: '生物医药与中试转化，园区仍在建设。启明医疗、东湖检验在园，白屿合成生物待入驻。',
  },
]

export const outputLabels = ['4月', '5月', '6月', '7月', '8月', '9月']

export const outputSeries: Series[] = [
  { name: '滨江云栖', color: chartColors.cyan, values: [8.4, 9.1, 9.6, 10.2, 11.4, 14.1] },
  { name: '临港智造', color: chartColors.gold, values: [12.2, 13.0, 13.8, 14.6, 16.2, 21.7] },
  { name: '光谷生命', color: chartColors.violet, values: [4.1, 4.4, 4.8, 5.2, 6.1, 7.5] },
]

export const spotlight = [
  {
    name: '星澜智造科技有限公司',
    enterpriseId: 'ent-xinglan',
    creditCode: '91330108MOCK00001X',
    park: '滨江云栖',
    phone: '0571-86001101',
    amount: '9月产值 1.2 亿',
    tag: '高风险',
  },
  {
    name: '海弈装备股份有限公司',
    enterpriseId: 'ent-haiyi',
    creditCode: '91310115MOCK00004X',
    park: '临港智造',
    phone: '021-58002101',
    amount: '注册资本 2 亿',
    tag: '中风险',
  },
  {
    name: '远能动力科技有限公司',
    enterpriseId: 'ent-yuanneng',
    creditCode: '91310115MOCK00005X',
    park: '临港智造',
    phone: '021-58002102',
    amount: '9月产值 0.8 亿',
    tag: '高风险',
  },
  {
    name: '启明医疗器械有限公司',
    enterpriseId: 'ent-qiming',
    creditCode: '91420100MOCK00007X',
    park: '光谷生命',
    phone: '027-87003101',
    amount: '注册资本 6000 万',
    tag: '低风险',
  },
]

export const alerts: FeedItem[] = [
  { id: 'a1', level: '紧急', title: '星澜智造危化品暂存台账缺页', meta: '滨江云栖 · 陈启明 · 待核查 · 0571-86001101' },
  { id: 'a2', level: '紧急', title: '远能动力储能舱消防演练缺席', meta: '临港智造 · 陈启明 · 待核查 · 021-58002102' },
  { id: 'a3', level: '紧急', title: '临港南侧异味投诉临近办结时限', meta: '临港智造 · 周岚 · 办理中 · 时限 2026-10-04' },
  { id: 'a4', level: '关注', title: '青禾生物废水在线监测夜间波动', meta: '滨江云栖 · 周岚 · 处置中 · 91330108MOCK00002X' },
  { id: 'a5', level: '关注', title: '海弈装备特种设备检验临期', meta: '临港智造 · 刘澄 · 处置中 · 91310115MOCK00004X' },
  { id: 'a6', level: '关注', title: '白屿合成生物废液联单滞后', meta: '光谷生命 · 刘澄 · 处置中 · 027-87003102' },
  { id: 'a7', level: '关注', title: '光谷 C2 中试楼施工噪声待受理', meta: '光谷生命 · 刘澄 · 待受理 · 027-87003903' },
  { id: 'a8', level: '提示', title: '临港保洁班组工资已过办结时限', meta: '临港智造 · 陈启明 · 办理中 · 时限 2026-10-02' },
  { id: 'a9', level: '提示', title: '云栖东侧预留地块 28 亩待供应', meta: '滨江云栖 · 刘澄 · 会商 · 计划 2026-12-01' },
  { id: 'a10', level: '提示', title: '峦数信息待入驻，社保开户未完成', meta: '滨江云栖 · 周岚 · 关注 · 91330108MOCK00003X' },
]

export const parcels: Parcel[] = [
  { parkId: 'park-binjiang', name: 'A1 研发楼', note: '入住率 86% · 在用', tone: 'use', heat: 0.86 },
  { parkId: 'park-binjiang', name: 'B2 实验楼', note: '入住率 74% · 四层东区闲置 510㎡', tone: 'idle', heat: 0.74 },
  { parkId: 'park-binjiang', name: '西侧工业地块', note: '86 亩 · 已供应给星澜智造', tone: 'use', heat: 0.9 },
  { parkId: 'park-binjiang', name: '东侧预留', note: '28 亩 · 规划科研 · 待供应', tone: 'reserve', heat: 0.2 },
  { parkId: 'park-lingang', name: 'M1 智能厂房', note: '入住率 91% · 四层东跨闲置 2400㎡', tone: 'risk', heat: 0.91 },
  { parkId: 'park-lingang', name: 'M2 动力站', note: '入住率 68% · 远能动力承租', tone: 'use', heat: 0.68 },
  { parkId: 'park-lingang', name: 'M 区制造地块', note: '160 亩 · 海弈装备', tone: 'use', heat: 0.88 },
  { parkId: 'park-lingang', name: '南侧物流地块', note: '54 亩 · 已收回 · 临时堆场', tone: 'risk', heat: 0.55 },
  { parkId: 'park-guanggu', name: 'C1 研发中心', note: '入住率 57% · 十二层闲置 1200㎡', tone: 'idle', heat: 0.57 },
  { parkId: 'park-guanggu', name: 'C2 中试楼', note: '入住率 33% · 四至六层闲置 5400㎡', tone: 'idle', heat: 0.33 },
  { parkId: 'park-guanggu', name: '西区中试地块', note: '73 亩 · 启明医疗器械', tone: 'use', heat: 0.62 },
  { parkId: 'park-guanggu', name: '东区预留', note: '39 亩未利用 · 另有闲置用地 46.5 亩', tone: 'reserve', heat: 0.16 },
]

export const riskCards: RiskCard[] = [
  {
    name: '星澜智造科技有限公司',
    enterpriseId: 'ent-xinglan',
    creditCode: '91330108MOCK00001X',
    park: '滨江云栖',
    phone: '0571-86001101',
    level: '高风险',
    score: 82,
    signal: '危化品暂存台账缺页',
  },
  {
    name: '远能动力科技有限公司',
    enterpriseId: 'ent-yuanneng',
    creditCode: '91310115MOCK00005X',
    park: '临港智造',
    phone: '021-58002102',
    level: '高风险',
    score: 86,
    signal: '储能舱消防演练缺席',
  },
  {
    name: '海弈装备股份有限公司',
    enterpriseId: 'ent-haiyi',
    creditCode: '91310115MOCK00004X',
    park: '临港智造',
    phone: '021-58002101',
    level: '中风险',
    score: 70,
    signal: '特种设备检验临期',
  },
  {
    name: '青禾生物医药有限公司',
    enterpriseId: 'ent-qinghe',
    creditCode: '91330108MOCK00002X',
    park: '滨江云栖',
    phone: '0571-86001102',
    level: '中风险',
    score: 64,
    signal: '废水在线监测夜间波动',
  },
  {
    name: '白屿合成生物有限公司',
    enterpriseId: 'ent-baiyu',
    creditCode: '91420100MOCK00008X',
    park: '光谷生命',
    phone: '027-87003102',
    level: '中风险',
    score: 61,
    signal: '中试废液转运联单滞后',
  },
  {
    name: '峦数信息技术有限公司',
    enterpriseId: 'ent-luanshu',
    creditCode: '91330108MOCK00003X',
    park: '滨江云栖',
    phone: '0571-86001103',
    level: '关注',
    score: 41,
    signal: '待入驻，社保开户未完成',
  },
]

export const industryBars: BarItem[] = [
  { label: '高端装备', value: 2 },
  { label: '人工智能', value: 1 },
  { label: '生物医药', value: 1 },
  { label: '新能源', value: 1 },
  { label: '软件信息', value: 1 },
  { label: '医疗器械', value: 1 },
  { label: '合成生物', value: 1 },
]

export const riskRings: RingItem[] = [
  { label: '高风险', value: 2, color: chartColors.rose },
  { label: '中风险', value: 3, color: chartColors.gold },
  { label: '关注', value: 1, color: chartColors.cyan },
  { label: '低风险', value: 2, color: chartColors.mint },
]

export const closureBars: BarItem[] = [
  { label: '待核查', value: 3 },
  { label: '处置中', value: 3 },
  { label: '已闭环', value: 2 },
]

export const scoreRows: ScoreRow[] = [
  { name: '政策兑现答复时效', park: '滨江云栖', category: '服务', score: 91, progress: '已归档' },
  { name: '载体出租率', park: '滨江云栖', category: '运行', score: 88, progress: '已评分' },
  { name: '制造业投资到位额', park: '临港智造', category: '招商', score: 84, progress: '已归档' },
  { name: '在建项目手续完备率', park: '光谷生命', category: '运行', score: 81, progress: '已归档' },
  { name: '投诉按期办结率', park: '临港智造', category: '服务', score: 76, progress: '已评分' },
]

export const shortfalls: FeedItem[] = [
  { id: 's1', level: '短板', title: '新入驻企业数仍在填报', meta: '滨江云栖 · 招商 · 得分先记 0 · 周岚' },
  { id: 's2', level: '短板', title: '特种设备按期检验率材料未齐', meta: '临港智造 · 安全 · 得分先记 0 · 陈启明' },
  { id: 's3', level: '短板', title: '中试危废联单及时率尚未启动', meta: '光谷生命 · 安全 · 得分先记 0 · 刘澄' },
]

export const categoryRings: RingItem[] = [
  { label: '运行', value: 2, color: chartColors.cyan },
  { label: '招商', value: 2, color: chartColors.gold },
  { label: '安全', value: 2, color: chartColors.rose },
  { label: '服务', value: 2, color: chartColors.mint },
]

export const complaintTypes: RingItem[] = [
  { label: '环境', value: 3, color: chartColors.mint },
  { label: '物业', value: 2, color: chartColors.cyan },
  { label: '劳务', value: 1, color: chartColors.gold },
  { label: '安全', value: 1, color: chartColors.rose },
  { label: '其他', value: 1, color: chartColors.violet },
]

export const complaintStatus: BarItem[] = [
  { label: '待受理', value: 2 },
  { label: '办理中', value: 2 },
  { label: '已办结', value: 3 },
  { label: '已退回', value: 1 },
]

export const complaintFeed: FeedItem[] = [
  { id: 'c1', level: '超时', title: '临港保洁班组工资拖延', meta: '临港智造 · 劳务 · 021-58002904 · 时限 2026-10-02' },
  { id: 'c2', level: '临期', title: '临港南侧夜间装卸异味', meta: '临港智造 · 环境 · 021-58002901 · 时限 2026-10-04' },
  { id: 'c3', level: '待受理', title: '临港 M 区打磨粉尘外溢', meta: '临港智造 · 环境 · 021-58002907 · 时限 2026-10-09' },
  { id: 'c4', level: '待受理', title: '光谷 C2 中试楼施工噪声', meta: '光谷生命 · 环境 · 027-87003903 · 时限 2026-10-08' },
  { id: 'c5', level: '已办结', title: '云栖 B2 消防通道堆物', meta: '滨江云栖 · 安全 · 0571-86001905' },
]

export const ownerBars: BarItem[] = [
  { label: '陈启明', value: 3, display: '3 条' },
  { label: '周岚', value: 3, display: '3 条' },
  { label: '刘澄', value: 4, display: '4 条' },
]

export const levelRings: RingItem[] = [
  { label: '紧急', value: 3, color: chartColors.rose },
  { label: '关注', value: 4, color: chartColors.gold },
  { label: '提示', value: 3, color: chartColors.cyan },
]

export const tickers: Record<string, TickerItem[]> = {
  overview: [
    { label: '在册企业', value: '12 家' },
    { label: '在园', value: '9 家' },
    { label: '三园规上产值', value: '186.4 亿元' },
    { label: '滨江云栖', value: '62.8 亿元 · 0571-86001001' },
    { label: '临港智造', value: '91.5 亿元 · 021-58002002' },
    { label: '光谷生命', value: '32.1 亿元 · 027-87003003' },
    { label: '星澜智造', value: '91330108MOCK00001X' },
    { label: '海弈装备', value: '91310115MOCK00004X' },
  ],
  space: [
    { label: '三园用地', value: '3260 亩' },
    { label: '待供应', value: '云栖东侧 28 亩 · 光谷东区 39 亩' },
    { label: '闲置厂房', value: '光谷 C2 5400㎡ · 临港 M1 东跨 2400㎡' },
    { label: '已盘活', value: '临港南区仓储棚 1800㎡' },
    { label: '云栖闲置', value: '1690㎡ 尚未盘活' },
    { label: '光谷闲置用地', value: '46.5 亩 · G-07' },
  ],
  'enterprise-risk': [
    { label: '高风险', value: '星澜智造 82 分 · 远能动力 86 分' },
    { label: '星澜信用代码', value: '91330108MOCK00001X' },
    { label: '远能信用代码', value: '91310115MOCK00005X' },
    { label: '海弈装备', value: '91310115MOCK00004X · 检验临期' },
    { label: '青禾生物', value: '91330108MOCK00002X · 废水波动' },
    { label: '已闭环', value: '锦帆物流保证金 · 启明医疗纳税提示' },
  ],
  assessment: [
    { label: '已归档最高分', value: '政策兑现答复时效 91' },
    { label: '滨江载体出租率', value: '88 分 · 已评分' },
    { label: '临港投资到位', value: '84 分 · 2025 年度已归档' },
    { label: '光谷手续完备率', value: '81 分 · 上半年已归档' },
    { label: '安全短板', value: '临港检验率、光谷联单及时率记 0' },
    { label: '招商短板', value: '云栖新入驻企业数仍在填报' },
  ],
  'complaint-heat': [
    { label: '受理', value: '8 件' },
    { label: '已办结', value: '3 件' },
    { label: '临港热力最高', value: '异味 · 工资 · 粉尘' },
    { label: '异味投诉', value: '021-58002901 · 韩柏' },
    { label: '工资投诉', value: '021-58002904 · 时限已过' },
    { label: '云栖消防通道', value: '0571-86001905 · 已办结' },
  ],
  alerts: [
    { label: '实时告警', value: '10 条演示' },
    { label: '紧急', value: '3 条未闭环' },
    { label: '承办', value: '陈启明 3 · 周岚 3 · 刘澄 4' },
    { label: '超时', value: '保洁工资 2026-10-02' },
    { label: '临期', value: '异味投诉 2026-10-04' },
    { label: '值班电话', value: '云栖 0571-86001001' },
  ],
}

export const sceneMetrics: Record<string, Metric[]> = {
  overview: [
    { label: '在册企业', value: 12, hint: '含已迁出档案', tone: 'cyan' },
    { label: '高风险', value: 2, hint: '星澜、远能待核查', tone: 'rose' },
    { label: '在办投诉', value: 4, hint: '办理中与待受理', tone: 'gold' },
    { label: '规上产值', value: 186.4, digits: 1, suffix: ' 亿', hint: '三园合计 · 虚构', tone: 'cyan' },
  ],
  space: [
    { label: '园区用地', value: 3260, suffix: ' 亩', hint: '三园规划范围', tone: 'cyan' },
    { label: '待供应', value: 67, suffix: ' 亩', hint: '云栖 28 · 光谷 39', tone: 'gold' },
    { label: '未盘活闲置', value: 10690, suffix: ' ㎡', hint: '不含已盘活仓储棚', tone: 'rose' },
    { label: '楼宇', value: 6, hint: '入住率 33%–91%', tone: 'cyan' },
  ],
  'enterprise-risk': [
    { label: '画像', value: 8, hint: '一企可有多条', tone: 'cyan' },
    { label: '高风险', value: 2, hint: '82 分与 86 分', tone: 'rose' },
    { label: '处置中', value: 3, hint: '尚未闭环', tone: 'gold' },
    { label: '已闭环', value: 2, hint: '保证金与纳税提示', tone: 'cyan' },
  ],
  assessment: [
    { label: '指标', value: 8, hint: '含历史周期', tone: 'cyan' },
    { label: '已出分', value: 5, hint: '已评分或已归档', tone: 'cyan' },
    { label: '最高分', value: 91, hint: '云栖政策兑现时效', tone: 'gold' },
    { label: '记 0 短板', value: 3, hint: '未开始或填报中', tone: 'rose' },
  ],
  'complaint-heat': [
    { label: '受理件', value: 8, hint: '含退回与咨询办结', tone: 'cyan' },
    { label: '环境类', value: 3, hint: '临港两件、光谷一件', tone: 'gold' },
    { label: '已办结', value: 3, hint: '办结率 37.5%', tone: 'cyan' },
    { label: '超时', value: 1, hint: '工资件时限 10-02', tone: 'rose' },
  ],
  alerts: [
    { label: '告警', value: 10, hint: '演示队列', tone: 'cyan' },
    { label: '紧急', value: 3, hint: '安全与投诉临期', tone: 'rose' },
    { label: '关注', value: 4, hint: '处置或待受理', tone: 'gold' },
    { label: '承办人', value: 3, hint: '陈启明、周岚、刘澄', tone: 'cyan' },
  ],
}

export function parkById(id: string): ParkNode {
  const found = parkNodes.find((item) => item.id === id) ?? parkNodes[0]
  if (!found) throw new Error('缺少园区样例')
  return found
}

export function metricsOf(key: string): Metric[] {
  return sceneMetrics[key] ?? []
}

export function tickerOf(key: string): TickerItem[] {
  return tickers[key] ?? []
}
