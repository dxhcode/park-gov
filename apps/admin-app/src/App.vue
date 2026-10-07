<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { adminTheme } from './theme'
</script>

<template>
  <a-config-provider :locale="zhCN" :theme="adminTheme" :auto-insert-space-in-button="false">
    <router-view />
  </a-config-provider>
</template>
