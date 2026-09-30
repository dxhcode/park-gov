export interface SceneNode {
  key: string
  code: string
  title: string
  path: string
  hint: string
  slots: string[]
}

export const scenes: SceneNode[] = [
  {
    key: 'overview',
    code: '01',
    title: '监管总览',
    path: '/overview',
    hint: '园区运行一屏总览。指标、地图与告警流尚未接入，此处只保留态势骨架。',
    slots: ['运行指标', '空间底图', '告警流', '重点企业'],
  },
  {
    key: 'space',
    code: '02',
    title: '空间态势',
    path: '/space',
    hint: '用地、用房与闲置的空间分布占位。图层与坐标尚未接入。',
    slots: ['用地图层', '用房图层', '闲置斑块', '载体热度'],
  },
  {
    key: 'enterprise-risk',
    code: '03',
    title: '企业风险',
    path: '/enterprise-risk',
    hint: '在园企业风险聚集情况占位。风险信号与画像尚未接入。',
    slots: ['风险等级', '行业分布', '异常信号', '处置闭环'],
  },
  {
    key: 'assessment',
    code: '04',
    title: '考核看板',
    path: '/assessment',
    hint: '园区考核进度与结果占位。指标得分尚未接入。',
    slots: ['指标进度', '得分结构', '短板项', '归档结果'],
  },
  {
    key: 'complaint-heat',
    code: '05',
    title: '投诉热力',
    path: '/complaint-heat',
    hint: '投诉举报的空间与类型分布占位。热力数据尚未接入。',
    slots: ['受理热力', '类型结构', '超时件', '办结率'],
  },
  {
    key: 'alerts',
    code: '06',
    title: '告警中心',
    path: '/alerts',
    hint: '监管告警汇聚与处置占位。告警源尚未接入。',
    slots: ['实时告警', '等级分布', '责任去向', '闭环时效'],
  },
]
