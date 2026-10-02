import type { Component } from 'vue'
import {
  AlertOutlined,
  AuditOutlined,
  BankOutlined,
  BarChartOutlined,
  CloudUploadOutlined,
  DashboardOutlined,
  EnvironmentOutlined,
  FileProtectOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue'

export interface MenuNode {
  key: string
  title: string
  icon?: Component
  path?: string
  hint?: string
  slots?: string[]
  children?: MenuNode[]
}

export const menus: MenuNode[] = [
  {
    key: 'workbench',
    title: '工作台',
    icon: DashboardOutlined,
    path: '/workbench',
    hint: '待办、预警与会商记在同一张清单里。本地样例可查、可改。',
    slots: ['待办事项', '预警摘要', '快捷入口'],
  },
  {
    key: 'enterprise',
    title: '企业监管',
    icon: BankOutlined,
    children: [
      {
        key: 'enterprise-directory',
        title: '企业名录',
        path: '/enterprise/directory',
        hint: '在园企业主体、统一社会信用代码与入驻状态。本地样例可查、可改。',
        slots: ['主体清单', '证照核验', '入驻台账'],
      },
      {
        key: 'enterprise-risk',
        title: '风险画像',
        path: '/enterprise/risk',
        hint: '按企业汇聚经营、安全、信用与环保风险信号。本地样例可查、可改。',
        slots: ['风险等级', '异常信号', '处置跟踪'],
      },
    ],
  },
  {
    key: 'space',
    title: '空间监管',
    icon: EnvironmentOutlined,
    children: [
      {
        key: 'space-land',
        title: '用地',
        path: '/space/land',
        hint: '园区用地供应、规划用途与实际利用对照。本地样例可查、可改。',
        slots: ['地块台账', '用途对照', '供应进度'],
      },
      {
        key: 'space-building',
        title: '用房',
        path: '/space/building',
        hint: '厂房、楼宇与载体的使用和承租情况。本地样例可查、可改。',
        slots: ['载体清单', '承租关系', '使用强度'],
      },
      {
        key: 'space-idle',
        title: '闲置',
        path: '/space/idle',
        hint: '闲置用地、闲置厂房的发现与盘活跟踪。本地样例可查、可改。',
        slots: ['闲置清单', '盘活进度', '超期提醒'],
      },
    ],
  },
  {
    key: 'assessment',
    title: '园区考核',
    icon: AuditOutlined,
    path: '/assessment',
    hint: '园区运行、招商、安全与服务考核指标。本地样例可查、可改。',
    slots: ['指标目录', '评分进度', '结果归档'],
  },
  {
    key: 'policy',
    title: '政策管理',
    icon: FileProtectOutlined,
    path: '/policy',
    hint: '扶持、监管、安全与人才条文，以及适用对象和发布状态。本地样例可查、可改。',
    slots: ['政策库', '适用对象', '发布状态'],
  },
  {
    key: 'complaint',
    title: '投诉举报',
    icon: AlertOutlined,
    path: '/complaint',
    hint: '投诉举报的受理、分派与办结。本地样例可查、可改。',
    slots: ['受理队列', '分派去向', '办结时效'],
  },
  {
    key: 'submission',
    title: '数据报送',
    icon: CloudUploadOutlined,
    path: '/submission',
    hint: '面向主管部门的定期报送任务与回执。本地样例可查、可改。',
    slots: ['报送任务', '填报进度', '回执存档'],
  },
  {
    key: 'analytics',
    title: '统计分析',
    icon: BarChartOutlined,
    path: '/analytics',
    hint: '报表条目和文字摘要可维护。图形与地图留到态势大屏第四日。',
    slots: ['主题报表', '周期对比', '导出占位'],
  },
  {
    key: 'settings',
    title: '系统设置',
    icon: SettingOutlined,
    path: '/settings',
    hint: '组织、角色与字典参数。本地样例可查、可改。登录会话仍在入口单独保存。',
    slots: ['组织架构', '角色权限', '字典参数'],
  },
]

export function findNode(nodes: MenuNode[], key: string): MenuNode | undefined {
  for (const node of nodes) {
    if (node.key === key) return node
    if (node.children) {
      const found = findNode(node.children, key)
      if (found) return found
    }
  }
  return undefined
}
