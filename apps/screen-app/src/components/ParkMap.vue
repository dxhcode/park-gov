<script setup lang="ts">
import { computed } from 'vue'
import { MapPanel } from '@park/components'
import type { MapMarker } from '@park/components'
import { mapMarkers } from '@park/mock'
import { parkNodes } from '../mock/dashboard'
import { useScreenStore } from '../stores/screen'

const props = withDefaults(
  defineProps<{
    mode?: 'overview' | 'complaint'
    title?: string
    extra?: string
  }>(),
  {
    mode: 'overview',
    title: '空间底图',
    extra: '',
  },
)

const screen = useScreenStore()

const markers = computed<MapMarker[]>(() =>
  mapMarkers.map((marker) => {
    const node = parkNodes.find((item) => item.id === marker.parkId)
    return {
      id: marker.parkId,
      name: node?.shortName ?? marker.name,
      shortName: node?.shortName ?? marker.shortName,
      x: marker.x,
      y: marker.y,
      status: marker.status,
      caption: props.mode === 'complaint' ? `投诉 ${node?.complaints ?? 0} 件` : node?.city,
    }
  }),
)
</script>

<template>
  <MapPanel
    class="screen-panel"
    :title="title"
    :markers="markers"
    :active-id="screen.focusParkId"
    @select="screen.focusPark"
  >
    <template v-if="extra" #extra>{{ extra }}</template>
  </MapPanel>
</template>
