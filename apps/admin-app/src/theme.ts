import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context'
import { theme } from 'ant-design-vue'

const fontFamily =
  '"Source Han Sans SC", "Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'

export const adminTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#0c4f8a',
    colorInfo: '#0c4f8a',
    colorWarning: '#a67c12',
    colorSuccess: '#1f7a4d',
    borderRadius: 8,
    fontFamily,
    colorBgLayout: '#e8eef5',
    colorText: '#14283f',
  },
  components: {
    Layout: {
      colorBgHeader: '#ffffff',
      colorBgBody: '#e8eef5',
      colorBgTrigger: '#0a1628',
    },
    Menu: {
      colorItemBg: 'transparent',
      colorSubItemBg: 'transparent',
      colorItemText: 'rgba(232, 240, 248, 0.86)',
      colorItemTextHover: '#ffffff',
      colorItemBgHover: 'rgba(255, 255, 255, 0.06)',
      colorItemTextSelected: '#f4d78a',
      colorItemBgSelected: 'rgba(94, 196, 255, 0.16)',
      radiusItem: 8,
      colorActiveBarWidth: 0,
      colorActiveBarBorderSize: 0,
    },
  },
}
