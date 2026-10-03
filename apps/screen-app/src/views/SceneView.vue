<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AlertScene from './scenes/AlertScene.vue'
import AssessmentScene from './scenes/AssessmentScene.vue'
import ComplaintScene from './scenes/ComplaintScene.vue'
import OverviewScene from './scenes/OverviewScene.vue'
import RiskScene from './scenes/RiskScene.vue'
import SpaceScene from './scenes/SpaceScene.vue'

const views = {
  overview: OverviewScene,
  space: SpaceScene,
  'enterprise-risk': RiskScene,
  assessment: AssessmentScene,
  'complaint-heat': ComplaintScene,
  alerts: AlertScene,
}

const route = useRoute()
const view = computed(() => views[route.name as keyof typeof views] ?? OverviewScene)
</script>

<template>
  <component :is="view" />
</template>
