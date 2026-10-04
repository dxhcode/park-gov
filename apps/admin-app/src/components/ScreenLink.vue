<script setup lang="ts">
import { useRoute } from 'vue-router'
import { openScreen } from '../utils/app-href'

const props = withDefaults(
  defineProps<{
    scene: string
    label?: string
  }>(),
  { label: '打开态势大屏' },
)

const route = useRoute()

function open() {
  openScreen(props.scene, route.path)
}
</script>

<template>
  <a-button class="screen-jump" @click="open">{{ label }}</a-button>
</template>
