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
    高风险: 'red',
    中风险: 'orange',
    低风险: 'blue',
    关注: 'gold',
    待核查: 'orange',
    处置中: 'gold',
    已闭环: 'green',
    已供应: 'green',
    待供应: 'gold',
    已收回: 'default',
    待办: 'blue',
    预警: 'red',
    会商: 'gold',
    紧急: 'red',
    普通: 'blue',
    知悉: 'default',
    未办: 'red',
    办理中: 'gold',
    已办结: 'green',
    未开始: 'default',
    填报中: 'gold',
    已评分: 'blue',
    已归档: 'green',
    草案: 'gold',
    已发布: 'green',
    已废止: 'default',
    待受理: 'red',
    已退回: 'orange',
    待填报: 'red',
    已报送: 'green',
    编制中: 'gold',
    可导出: 'blue',
    启用: 'green',
    停用: 'default',
    组织架构: 'blue',
    角色权限: 'gold',
    字典参数: 'cyan',
  }
  return map[props.value] ?? 'default'
})
</script>

<template>
  <a-tag :color="color">{{ value }}</a-tag>
</template>
