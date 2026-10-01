<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  value: string
}>()

const color = computed(() => {
  const map: Record<string, string> = {
    在园: 'green',
    待入驻: 'gold',
    已迁出: 'default',
    在用: 'green',
    空置待租: 'orange',
    装修中: 'blue',
    待盘活: 'red',
    洽谈中: 'gold',
    已盘活: 'green',
  }
  return map[props.value] ?? 'default'
})
</script>

<template>
  <a-tag :color="color">{{ value }}</a-tag>
</template>
