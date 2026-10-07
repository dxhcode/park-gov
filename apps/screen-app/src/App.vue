<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { screenAntdTheme } from '@park/theme'
</script>

<template>
  <a-config-provider :locale="zhCN" :theme="screenAntdTheme">
    <router-view />
  </a-config-provider>
</template>
