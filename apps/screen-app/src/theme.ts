import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context'
import { theme } from 'ant-design-vue'

const fontFamily =
  '"Source Han Sans SC", "Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'

export const screenTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#3fd4ff',
    colorInfo: '#3fd4ff',
    colorWarning: '#e2b657',
    borderRadius: 10,
    fontFamily,
    colorBgBase: '#07131e',
  },
}
