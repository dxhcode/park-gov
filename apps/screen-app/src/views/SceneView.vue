<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const title = computed(() => route.meta.title)
const hint = computed(() => route.meta.hint)
const code = computed(() => route.meta.code ?? '--')
const slots = computed(() => route.meta.slots)
</script>

<template>
  <section class="scene">
    <div class="radar" aria-hidden="true">
      <i class="ring ring-a" />
      <i class="ring ring-b" />
      <i class="ring ring-c" />
      <b class="core">{{ code }}</b>
    </div>
    <div class="copy">
      <p class="code">SCENE {{ code }}</p>
      <p class="badge">即将接入 · 第四日</p>
      <h2>{{ title }}</h2>
      <p class="hint">{{ hint }}</p>
      <p class="path">当前路由 {{ route.path }}</p>
    </div>
    <div class="glass">
      <p class="kicker">空态占位</p>
      <h3>本场景尚未铺开</h3>
      <p>不展示地图、图表或指标舱。下面的槽位只标明第四日要接的内容，数字和图层都留空。</p>
    </div>
    <ul class="channels">
      <li v-for="slot in slots" :key="slot">
        <span>{{ slot }}</span>
        <strong>即将呈现</strong>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.scene {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  grid-template-rows: auto auto auto;
  gap: 18px 28px;
  height: 100%;
  min-height: 420px;
  padding: 22px;
  background: linear-gradient(180deg, rgba(9, 28, 44, 0.42), rgba(6, 16, 28, 0.28));
  border: 1px solid rgba(180, 230, 255, 0.2);
  box-shadow: inset 0 0 80px rgba(40, 140, 190, 0.05);
  backdrop-filter: blur(10px);
}

.radar {
  position: relative;
  grid-row: 1 / span 3;
  place-self: center;
  width: 250px;
  height: 250px;
}

.ring {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(126, 235, 255, 0.35);
  border-radius: 50%;
}

.ring-a {
  background: repeating-conic-gradient(from 0deg, rgba(126, 235, 255, 0.28) 0 2deg, transparent 2deg 18deg);
  animation: spin 22s linear infinite;
}

.ring-b {
  inset: 28px;
  border-style: dashed;
  animation: spin 16s linear infinite reverse;
}

.ring-c {
  inset: 58px;
  box-shadow: 0 0 24px rgba(126, 235, 255, 0.18);
}

.core {
  position: absolute;
  inset: 86px;
  display: grid;
  place-items: center;
  color: #f3d48a;
  font-size: 28px;
  letter-spacing: 0.08em;
  background: radial-gradient(circle, rgba(18, 60, 88, 0.72), rgba(5, 14, 24, 0.55));
  border: 1px solid rgba(226, 182, 87, 0.7);
  border-radius: 50%;
  box-shadow: 0 0 24px rgba(226, 182, 87, 0.2);
  backdrop-filter: blur(8px);
}

.copy {
  align-self: end;
}

.code {
  margin: 0;
  color: #e2b657;
  font-size: 12px;
  letter-spacing: 0.28em;
}

.badge {
  display: inline-block;
  margin: 10px 0 0;
  padding: 4px 10px;
  color: #062033;
  font-size: 12px;
  letter-spacing: 0.14em;
  background: linear-gradient(90deg, rgba(240, 212, 138, 0.92), rgba(142, 239, 255, 0.92));
}

h2 {
  margin: 8px 0;
  font-size: 42px;
  letter-spacing: 0.12em;
  text-shadow: 0 0 18px rgba(126, 235, 255, 0.28);
}

.hint,
.path,
.glass p {
  max-width: 680px;
  margin: 0;
  color: rgba(214, 236, 246, 0.78);
  line-height: 1.75;
}

.path {
  margin-top: 8px;
  color: rgba(126, 235, 255, 0.8);
  font-size: 13px;
  letter-spacing: 0.04em;
}

.glass {
  padding: 16px 18px 14px;
  background: linear-gradient(180deg, rgba(186, 236, 255, 0.14), rgba(8, 20, 34, 0.28));
  border: 1px solid rgba(190, 236, 255, 0.32);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 16px 40px rgba(0, 0, 0, 0.16);
  backdrop-filter: blur(16px);
}

.kicker {
  color: #e2b657 !important;
  font-size: 12px;
  letter-spacing: 0.22em;
}

.glass h3 {
  margin: 6px 0 8px;
  color: #f4fbff;
  font-size: 20px;
  letter-spacing: 0.08em;
}

.channels {
  display: grid;
  grid-column: 2;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.channels li {
  padding: 14px 14px 12px;
  background: linear-gradient(180deg, rgba(186, 236, 255, 0.1), rgba(6, 20, 34, 0.45));
  border: 1px solid rgba(126, 235, 255, 0.22);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
}

.channels span {
  display: block;
  color: rgba(220, 242, 252, 0.8);
  font-size: 14px;
}

.channels strong {
  display: block;
  margin-top: 10px;
  color: rgba(226, 182, 87, 0.78);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.16em;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 980px) {
  .scene {
    grid-template-columns: 1fr;
    min-height: 0;
  }

  .radar {
    grid-row: auto;
  }

  .channels {
    grid-column: 1;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  h2 {
    font-size: 32px;
  }
}
</style>
