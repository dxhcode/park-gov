<script setup lang="ts">
import { parcels, parkNodes } from '../mock/dashboard'
import { useScreenStore } from '../stores/screen'

const screen = useScreenStore()

function blocks(parkId: string) {
  return parcels.filter((item) => item.parkId === parkId)
}

function select(id: string) {
  screen.focusPark(id)
}
</script>

<template>
  <div class="parcels">
    <button
      v-for="park in parkNodes"
      :key="park.id"
      type="button"
      class="park"
      :class="{ active: screen.focusParkId === park.id }"
      @click="select(park.id)"
    >
      <header>
        <strong>{{ park.shortName }}</strong>
        <em>{{ park.city }}</em>
      </header>
      <div class="grid">
        <span v-for="block in blocks(park.id)" :key="block.name" :class="block.tone" :style="{ '--h': block.heat }">
          <b>{{ block.name }}</b>
          <i>{{ block.note }}</i>
        </span>
      </div>
    </button>
  </div>
</template>

<style scoped>
.parcels {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  height: 100%;
}

.park {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  color: inherit;
  text-align: left;
  cursor: pointer;
  background: rgba(5, 16, 28, 0.35);
  border: 1px solid rgba(126, 235, 255, 0.2);
}

.park.active {
  border-color: rgba(226, 182, 87, 0.85);
  box-shadow: 0 0 18px rgba(226, 182, 87, 0.2);
}

header {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

strong {
  color: #f4fbff;
  letter-spacing: 0.08em;
}

em {
  color: rgba(190, 226, 240, 0.66);
  font-style: normal;
  font-size: 12px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  flex: 1;
}

.grid span {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 78px;
  padding: 8px;
  background:
    linear-gradient(180deg, transparent, rgba(4, 10, 18, 0.25)),
    rgba(126, 235, 255, calc(0.08 + var(--h) * 0.28));
  border: 1px solid rgba(126, 235, 255, 0.28);
  box-shadow: inset 0 0 16px rgba(126, 235, 255, calc(var(--h) * 0.35));
}

.idle {
  background:
    linear-gradient(180deg, transparent, rgba(4, 10, 18, 0.2)),
    rgba(226, 182, 87, 0.16);
  border-color: rgba(226, 182, 87, 0.45);
}

.reserve {
  background: rgba(126, 235, 255, 0.05);
  border-style: dashed;
}

.risk {
  background:
    linear-gradient(180deg, transparent, rgba(4, 10, 18, 0.2)),
    rgba(255, 122, 144, 0.18);
  border-color: rgba(255, 122, 144, 0.55);
  animation: glow 2.8s ease-in-out infinite;
}

b,
i {
  display: block;
}

b {
  color: #f4fbff;
  font-size: 13px;
}

i {
  margin-top: 4px;
  color: rgba(214, 236, 246, 0.72);
  font-style: normal;
  font-size: 11px;
  line-height: 1.45;
}

@keyframes glow {
  50% {
    box-shadow: 0 0 16px rgba(255, 122, 144, 0.35);
  }
}

@media (max-width: 980px) {
  .parcels {
    grid-template-columns: 1fr;
  }
}
</style>
