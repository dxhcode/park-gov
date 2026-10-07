import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context'
import { theme } from 'ant-design-vue'

const fontFamily =
  '"Source Han Sans SC", "Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'

/** 管理端与大屏共用的图表色。改色时同步两边 global.css 的同名变量。 */
export const chartColors = {
  cyan: '#7eebff',
  gold: '#e2b657',
  violet: '#b9a6ff',
  rose: '#ff7a90',
  mint: '#7dffa8',
} as const

export const screenTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: chartColors.cyan,
    colorInfo: chartColors.cyan,
    colorWarning: chartColors.gold,
    borderRadius: 10,
    fontFamily,
    colorBgBase: '#07131e',
  },
}
