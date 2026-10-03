export interface SceneNode {
  key: string
  code: string
  title: string
  path: string
  hint: string
  slots: string[]
  adminPath: string
}

export const scenes: SceneNode[] = [
  {
    key: 'overview',
    code: '01',
    title: '监管总览',
    path: '/overview',
    hint: '三园产值、企业和告警同屏。',
    slots: ['运行指标', '空间底图', '告警流', '重点企业'],
    adminPath: '/workbench',
  },
  {
    key: 'space',
    code: '02',
    title: '空间态势',
    path: '/space',
    hint: '用地、用房和闲置铺在载体热力图上。',
    slots: ['用地图层', '用房图层', '闲置斑块', '载体热度'],
    adminPath: '/space/land',
  },
  {
    key: 'enterprise-risk',
    code: '03',
    title: '企业风险',
    path: '/enterprise-risk',
    hint: '风险等级、行业分布和处置闭环。',
    slots: ['风险等级', '行业分布', '异常信号', '处置闭环'],
    adminPath: '/enterprise/risk',
  },
  {
    key: 'assessment',
    code: '04',
    title: '考核看板',
    path: '/assessment',
    hint: '已出分指标和仍记 0 分的短板。',
    slots: ['指标进度', '得分结构', '短板项', '归档结果'],
    adminPath: '/assessment',
  },
  {
    key: 'complaint-heat',
    code: '05',
    title: '投诉热力',
    path: '/complaint-heat',
    hint: '投诉热力、类型结构和超时件。',
    slots: ['受理热力', '类型结构', '超时件', '办结率'],
    adminPath: '/complaint',
  },
  {
    key: 'alerts',
    code: '06',
    title: '告警中心',
    path: '/alerts',
    hint: '告警滚动、等级分布和承办去向。',
    slots: ['实时告警', '等级分布', '责任去向', '闭环时效'],
    adminPath: '/workbench',
  },
]
