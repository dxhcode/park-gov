import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context'
import { adminAntdTheme } from '@park/theme'

/**
 * 在共享管理端令牌上保留深色侧栏菜单。
 * 内容区、主色和顶栏底色来自 @park/theme。
 */
export const adminTheme: ThemeConfig = {
  ...adminAntdTheme,
  components: {
    ...adminAntdTheme.components,
    Menu: {
      colorItemBg: 'transparent',
      colorSubItemBg: 'transparent',
      colorItemText: 'rgba(244, 247, 255, 0.86)',
      colorItemTextHover: '#ffffff',
      colorItemBgHover: 'rgba(255, 255, 255, 0.06)',
      colorItemTextSelected: '#c6a15b',
      colorItemBgSelected: 'rgba(198, 161, 91, 0.16)',
      radiusItem: 8,
      colorActiveBarWidth: 0,
      colorActiveBarBorderSize: 0,
    },
  },
}
