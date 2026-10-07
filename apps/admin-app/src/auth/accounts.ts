export type DemoRole = 'duty' | 'enterprise' | 'space'

export interface DemoAccount {
  username: string
  password: string
  displayName: string
  orgName: string
  dutyLabel: string
  role: DemoRole
}

export interface SessionUser {
  username: string
  displayName: string
  orgName: string
  dutyLabel: string
  role: DemoRole
  loggedInAt: string
}

/** 演示账号。密码写在登录页上，只用于本地原型。 */
export const demoAccounts: DemoAccount[] = [
  {
    username: 'chenqm',
    password: 'Park@2026',
    displayName: '陈启明',
    orgName: '园区管理委员会',
    dutyLabel: '值班席',
    role: 'duty',
  },
  {
    username: 'zhoulan',
    password: 'Park@2026',
    displayName: '周岚',
    orgName: '经济发展局',
    dutyLabel: '企业监管专员',
    role: 'enterprise',
  },
  {
    username: 'liucheng',
    password: 'Park@2026',
    displayName: '刘澄',
    orgName: '规划建设局',
    dutyLabel: '空间监管专员',
    role: 'space',
  },
]

export const SESSION_KEY = 'park-gov.session'
