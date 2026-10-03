<script setup lang="ts">
import { parkNodes } from '../mock/dashboard'
import { useScreenStore } from '../stores/screen'

const props = withDefaults(
  defineProps<{
    mode?: 'overview' | 'complaint'
  }>(),
  { mode: 'overview' },
)

const screen = useScreenStore()
const uid = `map-${Math.random().toString(36).slice(2, 8)}`

function radius(heat: number, complaints: number) {
  if (props.mode === 'complaint') return 22 + complaints * 16
  return 26 + heat * 42
}

function select(id: string) {
  screen.focusPark(id)
}
</script>

<template>
  <svg class="map" viewBox="0 0 640 420" role="img" aria-label="三园空间态势">
    <defs>
      <radialGradient :id="`${uid}-sea`" cx="50%" cy="45%" r="65%">
        <stop offset="0%" stop-color="#12324d" />
        <stop offset="100%" stop-color="#071018" />
      </radialGradient>
      <linearGradient :id="`${uid}-land`" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1c4d68" />
        <stop offset="100%" stop-color="#0d2436" />
      </linearGradient>
      <filter :id="`${uid}-glow`" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <rect width="640" height="420" :fill="`url(#${uid}-sea)`" />
    <g class="grid" aria-hidden="true">
      <path v-for="row in 7" :key="`r${row}`" :d="`M20 ${row * 52} H620`" />
      <path v-for="col in 10" :key="`c${col}`" :d="`M${col * 60} 16 V400`" />
    </g>
    <path
      class="land"
      :fill="`url(#${uid}-land)`"
      d="M70 70 C180 36 250 110 310 78 C390 38 470 90 560 64 C610 120 590 190 610 250 C560 300 590 360 500 380 C390 404 300 340 210 372 C120 400 70 330 48 250 C30 170 40 110 70 70Z"
    />
    <path class="river" d="M120 250 C220 210 280 280 360 230 C450 176 500 220 590 168" />
    <text class="city" x="250" y="228">武汉</text>
    <text class="city" x="430" y="292">杭州</text>
    <text class="city" x="520" y="168">上海</text>

    <g
      v-for="park in parkNodes"
      :key="park.id"
      class="node"
      :class="[park.id, { active: screen.focusParkId === park.id }]"
      @click="select(park.id)"
    >
      <circle
        class="heat"
        :cx="park.x"
        :cy="park.y"
        :r="radius(park.heat, park.complaints)"
        :filter="`url(#${uid}-glow)`"
      />
      <circle class="pulse" :cx="park.x" :cy="park.y" r="7" />
      <circle class="core" :cx="park.x" :cy="park.y" r="4" />
      <text class="name" :x="park.x" :y="park.y + radius(park.heat, park.complaints) + 16">
        {{ park.shortName }}
      </text>
    </g>
  </svg>
</template>

<style scoped>
.map {
  width: 100%;
  height: 100%;
  min-height: 240px;
}

.grid path {
  fill: none;
  stroke: rgba(126, 235, 255, 0.08);
}

.land {
  stroke: rgba(142, 235, 255, 0.35);
  stroke-width: 1.2;
}

.river {
  fill: none;
  stroke: rgba(126, 235, 255, 0.55);
  stroke-width: 3;
  stroke-linecap: round;
  filter: drop-shadow(0 0 6px rgba(126, 235, 255, 0.6));
}

.city {
  fill: rgba(214, 236, 246, 0.35);
  font-size: 13px;
  letter-spacing: 0.2em;
}

.node {
  cursor: pointer;
}

.heat {
  fill: rgba(126, 235, 255, 0.22);
  stroke: rgba(126, 235, 255, 0.45);
}

.park-binjiang .heat {
  fill: rgba(226, 182, 87, 0.24);
  stroke: rgba(226, 182, 87, 0.5);
}

.park-lingang .heat {
  fill: rgba(255, 122, 144, 0.28);
  stroke: rgba(255, 176, 190, 0.5);
}

.active .heat {
  stroke: #f3d48a;
  stroke-width: 2;
}

.pulse {
  fill: none;
  stroke: #9aefff;
  stroke-width: 1.4;
  transform-box: fill-box;
  transform-origin: center;
  animation: pulse 2.6s ease-out infinite;
}

.core {
  fill: #f4fbff;
  stroke: #e2b657;
}

.name {
  fill: #f4fbff;
  font-size: 13px;
  text-anchor: middle;
  letter-spacing: 0.12em;
}

@keyframes pulse {
  0% {
    opacity: 0.9;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(3.2);
  }
}
</style>
