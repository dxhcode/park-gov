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
    hint: '总览仍是玻璃占位。地图、图表和指标舱留到第四日，这里不铺驾驶舱。',
    slots: ['运行指标', '空间底图', '告警流', '重点企业'],
  },
  {
    key: 'space',
    code: '02',
    title: '空间态势',
    path: '/space',
    hint: '用地、用房与闲置的分布留白。图层和坐标第四日再接，当前只保留槽位。',
    slots: ['用地图层', '用房图层', '闲置斑块', '载体热度'],
  },
  {
    key: 'enterprise-risk',
    code: '03',
    title: '企业风险',
    path: '/enterprise-risk',
    hint: '风险聚集图尚未铺开。管理端画像可以先查，大屏只显示即将呈现的槽位。',
    slots: ['风险等级', '行业分布', '异常信号', '处置闭环'],
  },
  {
    key: 'assessment',
    code: '04',
    title: '考核看板',
    path: '/assessment',
    hint: '考核得分和结构图留到第四日。此处不展示分数舱。',
    slots: ['指标进度', '得分结构', '短板项', '归档结果'],
  },
  {
    key: 'complaint-heat',
    code: '05',
    title: '投诉热力',
    path: '/complaint-heat',
    hint: '热力、类型结构和办结率图形都还没接。当前是空态玻璃占位。',
    slots: ['受理热力', '类型结构', '超时件', '办结率'],
  },
  {
    key: 'alerts',
    code: '06',
    title: '告警中心',
    path: '/alerts',
    hint: '告警流和等级分布留到第四日。这里不滚动实时列表。',
    slots: ['实时告警', '等级分布', '责任去向', '闭环时效'],
  },
]
